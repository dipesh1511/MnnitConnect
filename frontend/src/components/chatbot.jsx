import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(savedMessages);
  }, []);

  // Save messages to localStorage on update
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    try {
      const response = await axios.post("http://localhost:8000/api/chat", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      console.error("Chatbot error:", error);
    }

    setInput(""); // Clear input after sending
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-[500px] bg-white text-gray-900 p-4 rounded-xl shadow-2xl relative">
        <h3 className="text-lg font-bold mb-3 text-center text-blue-600">Chat with MNNIT-Connect</h3>
        <div className="h-80 overflow-y-auto p-3 space-y-3 scrollbar-hide bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`px-4 py-2 rounded-lg max-w-[75%] text-sm shadow ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex mt-4 rounded-md shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Handle "Enter" key
            placeholder="Ask me anything..."
            className="flex-1 p-3 rounded-l-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-blue-600 text-white rounded-r-md font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
