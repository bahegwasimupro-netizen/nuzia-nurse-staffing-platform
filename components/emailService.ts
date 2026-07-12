import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID_ASSIGNED = import.meta.env.VITE_EMAILJS_TEMPLATE_ASSIGNED || "";
const TEMPLATE_ID_PAYMENT = import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENT || "";
const TEMPLATE_ID_VERIFY = import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFY || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

function isConfigured(): boolean {
  return !!(SERVICE_ID && PUBLIC_KEY && TEMPLATE_ID_ASSIGNED);
}

export async function sendJobAssignedEmail(
  nurseEmail: string,
  nurseName: string,
  clientName: string,
  jobType: string,
  location: string,
  datetime: string
): Promise<boolean> {
  if (!isConfigured()) {
    console.info("EmailJS not configured, skipping email");
    return false;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_ASSIGNED, {
      to_name: nurseName,
      to_email: nurseEmail,
      client_name: clientName,
      job_type: jobType,
      location,
      datetime,
      platform_name: "Nuzia",
    }, PUBLIC_KEY);
    return true;
  } catch (e) {
    console.warn("Email send failed:", e);
    return false;
  }
}

export async function sendPaymentConfirmationEmail(
  clientEmail: string,
  clientName: string,
  amount: string,
  nurseName: string,
  jobType: string
): Promise<boolean> {
  if (!isConfigured()) {
    console.info("EmailJS not configured, skipping email");
    return false;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_PAYMENT, {
      to_name: clientName,
      to_email: clientEmail,
      amount,
      nurse_name: nurseName,
      job_type: jobType,
      platform_name: "Nuzia",
    }, PUBLIC_KEY);
    return true;
  } catch (e) {
    console.warn("Email send failed:", e);
    return false;
  }
}

export async function sendVerificationEmail(
  nurseEmail: string,
  nurseName: string,
  status: "approved" | "rejected"
): Promise<boolean> {
  if (!isConfigured()) {
    console.info("EmailJS not configured, skipping email");
    return false;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_VERIFY, {
      to_name: nurseName,
      to_email: nurseEmail,
      status,
      platform_name: "Nuzia",
    }, PUBLIC_KEY);
    return true;
  } catch (e) {
    console.warn("Email send failed:", e);
    return false;
  }
}
