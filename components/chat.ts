import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, Timestamp, where, getDocs, limit } from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastSenderId: string;
  jobId: string;
}

export async function findOrCreateChat(
  clientId: string,
  clientName: string,
  nurseId: string,
  nurseName: string,
  jobId: string,
  isMock: boolean
): Promise<string> {
  if (isMock) {
    return `chat-${jobId}`;
  }

  const q = query(
    collection(db, "chats"),
    where("jobId", "==", jobId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].id;

  const chatRef = await addDoc(collection(db, "chats"), {
    participants: [clientId, nurseId],
    participantNames: { [clientId]: clientName, [nurseId]: nurseName },
    jobId,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    lastSenderId: "",
    createdAt: serverTimestamp(),
  });
  return chatRef.id;
}

export function sendMessage(
  chatId: string,
  senderId: string,
  senderName: string,
  text: string,
  isMock: boolean
): void {
  if (isMock) {
    const key = `nuzia_chat_${chatId}`;
    const msgs = JSON.parse(localStorage.getItem(key) || "[]");
    msgs.push({
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      text,
      createdAt: { seconds: Date.now() / 1000 },
      read: false,
    });
    localStorage.setItem(key, JSON.stringify(msgs));
    window.dispatchEvent(new Event("chat-updated"));
    return;
  }

  addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    senderName,
    text,
    read: false,
    createdAt: serverTimestamp(),
  });

  updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
  });
}

export function subscribeToMessages(
  chatId: string,
  isMock: boolean,
  callback: (messages: ChatMessage[]) => void
): () => void {
  if (isMock) {
    const key = `nuzia_chat_${chatId}`;
    const load = () => {
      const msgs = JSON.parse(localStorage.getItem(key) || "[]");
      callback(msgs);
    };
    load();
    const handler = () => load();
    window.addEventListener("chat-updated", handler);
    return () => window.removeEventListener("chat-updated", handler);
  }

  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({
      id: d.id,
      chatId,
      ...d.data(),
    })) as ChatMessage[];
    callback(msgs);
  });
}

export function subscribeToChatRooms(
  userId: string,
  isMock: boolean,
  callback: (rooms: ChatRoom[]) => void
): () => void {
  if (isMock) {
    const load = () => {
      const allKeys = Object.keys(localStorage).filter((k) => k.startsWith("nuzia_chat_"));
      const rooms: ChatRoom[] = allKeys.map((k) => {
        const chatId = k.replace("nuzia_chat_", "").replace("nuzia_mock_chat_", "");
        return {
          id: chatId,
          participants: [userId],
          participantNames: {},
          lastMessage: "",
          lastMessageAt: { seconds: 0 } as any,
          lastSenderId: "",
          jobId: chatId.replace("chat-", ""),
        };
      });
      callback(rooms);
    };
    load();
    const handler = () => load();
    window.addEventListener("chat-updated", handler);
    return () => window.removeEventListener("chat-updated", handler);
  }

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  return onSnapshot(q, (snap) => {
    const rooms = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ChatRoom[];
    callback(rooms);
  });
}
