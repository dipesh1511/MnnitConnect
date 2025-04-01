import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSearch, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.js";

const MessagesPage = () => {
  const [connectedUsers, setConnectedUsers] = useState([]); // Store connected users
  const [filteredUsers, setFilteredUsers] = useState([]); // For search filtering
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axiosInstance.get("/connections"); // Fetch connections
        setConnectedUsers(response.data);
        setFilteredUsers(response.data); // Initially show all
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnectedUsers();
  }, []);

  // Handle user selection for messaging
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessage("");
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    console.log(`Message sent to ${selectedUser.name}:`, message);
    setMessage(""); // Clear input after sending
  };

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      connectedUsers.filter((user) =>
        user.name.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Users List */}
      <div className="w-1/3 bg-white shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-3 py-2 border rounded-md"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>

        {/* User List */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 rounded-md"
              onClick={() => handleSelectUser(user)}
            >
              <img
                src={user.profilePicture || "https://via.placeholder.com/50"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-gray-700">{user.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Right: Chat Window */}
      <div className="w-2/3 bg-white shadow-lg p-4">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-2 mb-4">
              <img
                src={selectedUser.profilePicture || "https://via.placeholder.com/50"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
            </div>

            {/* Chat Messages (Demo Placeholder) */}
            <div className="border rounded-md p-4 h-64 bg-gray-50 overflow-y-auto">
              <p className="text-gray-500 italic">
                Start chatting with {selectedUser.name}...
              </p>
            </div>

            {/* Message Input */}
            <div className="mt-4 flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow border rounded-md px-3 py-2"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center transition duration-200 hover:bg-blue-600"
              >
                <FaPaperPlane className="mr-1" /> Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">Select a user to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
