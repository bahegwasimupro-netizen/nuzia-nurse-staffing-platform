import { useState, useRef, useEffect } from "react";
import { useAuth } from "./auth";
import { useLang } from "./language";
import { sendMessage, subscribeToMessages, type ChatMessage } from "./chat";
import { Send, X, MessageCircle } from "lucide-react";

interface ChatPanelProps {
  chatId: string;
  otherName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ chatId, otherName, isOpen, onClose }: ChatPanelProps) {
  const { userProfile, isMock } = useAuth();
  const { lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToMessages(chatId, isMock, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, [chatId, isOpen, isMock]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !userProfile) return;
    sendMessage(chatId, userProfile.uid, userProfile.name, input.trim(), isMock);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-white text-sm">{otherName}</h3>
              <p className="text-[10px] text-white/60">{lang === "sw" ? "Mazungumzo ya moja kwa moja" : "Direct message"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center text-sm text-slate-400 py-8">
              {lang === "sw" ? "Hakuna ujumbe bado. Anza mazungumzo!" : "No messages yet. Start the conversation!"}
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderId === userProfile?.uid;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine ? "bg-[#1e3a5f] text-white rounded-br-sm" : "bg-white border rounded-bl-sm shadow-sm"}`}>
                  {!isMine && <p className="text-[10px] font-bold text-[#1e3a5f] mb-0.5">{msg.senderName}</p>}
                  <p className={`text-sm ${isMine ? "text-white" : "text-slate-700"}`}>{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${isMine ? "text-white/50" : "text-slate-400"}`}>
                    {msg.createdAt?.seconds
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString(lang === "sw" ? "sw-TZ" : "en-US", { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={lang === "sw" ? "Andika ujumbe..." : "Type a message..."}
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#1e3a5f] hover:bg-[#2563eb] disabled:bg-slate-200 text-white rounded-xl px-4 py-2.5 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
