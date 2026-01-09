import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.response },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server tidak merespons." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-2">
      <div className="w-full max-w-3xl h-[95vh] sm:h-[85vh] bg-[#0A2A43] rounded-xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="text-center text-white font-semibold py-3 border-b border-[#18C6D1]/30">
          ML Bot Primakara
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18C6D1] flex items-center justify-center mr-2 text-black font-bold">
                  B
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl text-sm sm:text-base max-w-[75%] sm:max-w-[65%] wrap-break-words ${
                  msg.sender === "user"
                    ? "bg-[#18C6D1] text-black rounded-br-none"
                    : "bg-[#0B0F14] text-white border border-[#18C6D1]/30 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18C6D1] flex items-center justify-center ml-2 text-black font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-[#AAB4C3] italic text-sm">
              Bot sedang mengetik...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="border-t border-[#18C6D1]/30 p-3 flex gap-2 bg-[#0A2A43]">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ketik pesan..."
            className="flex-1 bg-[#0B0F14] text-white px-4 py-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#18C6D1]"
          />
          <button
            onClick={sendMessage}
            className="bg-[#18C6D1] text-black font-semibold px-4 sm:px-6 rounded-lg hover:opacity-90"
          >
            Kirim
          </button>
        </div>

      </div>
    </div>
  );
}
