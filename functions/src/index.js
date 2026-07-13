const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fetch = require("node-fetch");

initializeApp();
const db = getFirestore();

// M-Pesa Tanzania (Vodacom) Daraja API config
const MPESA_CONFIG = {
  apiKey: process.env.MPESA_API_KEY || "",
  apiSecret: process.env.MPESA_API_SECRET || "",
  initiatorName: process.env.MPESA_INITIATOR_NAME || "nuzia",
  publicKey: process.env.MPESA_PUBLIC_KEY || "",
  callbackUrl: process.env.MPESA_CALLBACK_URL || "",
  environment: process.env.MPESA_ENV || "sandbox",
};

const BASE_URL =
  MPESA_CONFIG.environment === "production"
    ? "https://apiportal.vodacom.tz"
    : "https://sandbox.vodacom.tz";

// Get OAuth access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${MPESA_CONFIG.apiKey}:${MPESA_CONFIG.apiSecret}`
  ).toString("base64");

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await res.json();
  return data.access_token;
}

// 1. Initiate STK Push
exports.initiateStkPush = onRequest(
  { cors: true, region: "africa-south1" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { phone, amount, jobId, clientId, nurseId, accountRef } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: "phone and amount required" });
    }

    // Format phone: remove leading 0, ensure 255 prefix
    const cleanedPhone = phone
      .replace(/\s/g, "")
      .replace(/^0/, "255")
      .replace(/^\+255/, "255");

    try {
      const accessToken = await getAccessToken();

      // Create payment record first
      const paymentId = `stk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentRef = db.collection("payments").doc(paymentId);
      await paymentRef.set({
        id: paymentId,
        jobId: jobId || "",
        clientId: clientId || "",
        nurseId: nurseId || "",
        amount: Number(amount),
        method: "mpesa",
        phone: cleanedPhone,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // Initiate STK Push
      const stkPayload = {
        MerchantRequestID: paymentId,
        BusinessShortCode: process.env.MPESA_SHORT_CODE || "174379",
        Password: Buffer.from(
          `${process.env.MPESA_SHORT_CODE || "174379"}${
            process.env.MPESA_PASSKEY || ""
          }${new Date()
            .toISOString()
            .replace(/[-T:.Z]/g, "")
            .slice(0, 14)}`
        ).toString("base64"),
        Timestamp: new Date()
          .toISOString()
          .replace(/[-T:.Z]/g, "")
          .slice(0, 14),
        TransactionType: "CustomerPayBillOnline",
        Amount: String(Math.round(Number(amount))),
        PartyA: cleanedPhone,
        PartyB: process.env.MPESA_SHORT_CODE || "174379",
        PhoneNumber: cleanedPhone,
        CallBackURL: MPESA_CONFIG.callbackUrl || `https://africa-south1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/mpesaCallback`,
        AccountReference: accountRef || jobId || "nuzia",
        TransactionDesc: `Nuzia payment for ${jobId || "service"}`,
      };

      const stkRes = await fetch(
        `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stkPayload),
        }
      );

      const stkData = await stkRes.json();

      if (stkData.ResponseCode === "0" || stkData.ResponseCode === "2001") {
        // Success - STK push sent to customer
        await paymentRef.update({
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          status: "processing",
        });

        return res.status(200).json({
          success: true,
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          status: "processing",
        });
      } else {
        // Failed
        await paymentRef.update({ status: "failed" });
        return res.status(400).json({
          success: false,
          error: stkData.ResponseDescription || "STK push failed",
          responseCode: stkData.ResponseCode,
        });
      }
    } catch (error) {
      console.error("STK Push error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// 2. M-Pesa Callback Handler
exports.mpesaCallback = onRequest(
  { cors: true, region: "africa-south1" },
  async (req, res) => {
    // Safaricom/Vodacom sends callback here after customer completes or cancels STK
    const body = req.body;

    console.log("M-Pesa Callback received:", JSON.stringify(body));

    // Extract callback data
    const stkCallback = body?.Body?.stkCallback || body?.stkCallback || body;

    if (!stkCallback) {
      console.log("No stkCallback in body");
      return res.status(200).json({ ResultCode: 0, ResultDesc: "OK" });
    }

    const merchantRequestId = stkCallback.MerchantRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find the payment record
    try {
      const paymentsRef = db.collection("payments");
      const snapshot = await paymentsRef
        .where("merchantRequestId", "==", merchantRequestId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        // Try by MerchantRequestID as document ID
        const directDoc = await paymentsRef.doc(merchantRequestId).get();
        if (directDoc.exists) {
          const paymentData = directDoc.data();
          if (resultCode === 0) {
            // Payment successful
            const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
            const mpesaReceipt = callbackMetadata.find(
              (i) => i.Name === "MpesaReceiptNumber"
            )?.Value;

            await directDoc.ref.update({
              status: "completed",
              mpesaReceipt: mpesaReceipt || "",
              completedAt: new Date().toISOString(),
            });

            // Update job payment status
            if (paymentData.jobId) {
              await db
                .collection("jobs")
                .doc(paymentData.jobId)
                .update({
                  paymentStatus: "Paid",
                  paymentId: directDoc.id,
                  paidAt: new Date().toISOString(),
                });
            }
          } else {
            // Payment failed
            await directDoc.ref.update({
              status: "failed",
              failureReason: resultDesc,
            });
          }
        }
      } else {
        const doc = snapshot.docs[0];
        const paymentData = doc.data();

        if (resultCode === 0) {
          // Payment successful
          const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
          const mpesaReceipt = callbackMetadata.find(
            (i) => i.Name === "MpesaReceiptNumber"
          )?.Value;

          await doc.ref.update({
            status: "completed",
            mpesaReceipt: mpesaReceipt || "",
            completedAt: new Date().toISOString(),
          });

          // Update job payment status
          if (paymentData.jobId) {
            await db
              .collection("jobs")
              .doc(paymentData.jobId)
              .update({
                paymentStatus: "Paid",
                paymentId: doc.id,
                paidAt: new Date().toISOString(),
              });
          }
        } else {
          // Payment failed
          await doc.ref.update({
            status: "failed",
            failureReason: resultDesc,
          });
        }
      }
    } catch (error) {
      console.error("Callback processing error:", error);
    }

    // Always respond 200 to Safaricom/Vodacom
    return res.status(200).json({ ResultCode: 0, ResultDesc: "OK" });
  }
);

// 3. Check Payment Status
exports.checkPaymentStatus = onRequest(
  { cors: true, region: "africa-south1" },
  async (req, res) => {
    const paymentId = req.query.id || req.body?.id;

    if (!paymentId) {
      return res.status(400).json({ error: "payment id required" });
    }

    try {
      const doc = await db.collection("payments").doc(paymentId).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const payment = doc.data();

      // If still processing, query Daraja for status
      if (payment.status === "processing" && payment.checkoutRequestId) {
        try {
          const accessToken = await getAccessToken();
          const queryRes = await fetch(
            `${BASE_URL}/mpesa/stkpushquery/v1/query`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                BusinessShortCode:
                  process.env.MPESA_SHORT_CODE || "174379",
                Password: Buffer.from(
                  `${process.env.MPESA_SHORT_CODE || "174379"}${
                    process.env.MPESA_PASSKEY || ""
                  }${new Date()
                    .toISOString()
                    .replace(/[-T:.Z]/g, "")
                    .slice(0, 14)}`
                ).toString("base64"),
                Timestamp: new Date()
                  .toISOString()
                  .replace(/[-T:.Z]/g, "")
                  .slice(0, 14),
                CheckoutRequestID: payment.checkoutRequestId,
              }),
            }
          );

          const queryData = await queryRes.json();

          if (queryData.ResultCode === "0") {
            await doc.ref.update({
              status: "completed",
              completedAt: new Date().toISOString(),
            });
            payment.status = "completed";
          } else if (
            queryData.ResultCode === "1032" ||
            queryData.ResultCode === "1"
          ) {
            await doc.ref.update({ status: "failed" });
            payment.status = "failed";
          }
          // else still processing
        } catch (queryError) {
          console.error("Status query error:", queryError);
        }
      }

      return res.status(200).json({
        status: payment.status,
        paymentId: doc.id,
        amount: payment.amount,
        mpesaReceipt: payment.mpesaReceipt || null,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// 4. Create admin user helper
exports.createAdminUser = onRequest(
  { cors: true, region: "africa-south1" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { uid, email, name } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email required" });
    }

    try {
      await db.collection("users").doc(uid).set(
        {
          uid,
          email,
          name: name || "Admin",
          role: "admin",
          verificationStatus: "verified",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return res.status(200).json({ success: true, uid });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);
