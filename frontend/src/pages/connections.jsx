// Connections.js
import React from "react";
import ConnectionCard from "../components/connectionCard";
import MyConnections from "../components/myconnection";

const Connections = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4">
      {/* Left Side: MyConnections */}
      <div className="w-full md:w-1/2 md:mr-4 mb-4">
        <MyConnections />
      </div>

      {/* Right Side: ConnectionCard */}
      <div className="w-full md:w-1/2 md:ml-4">
        <ConnectionCard/>
      </div>
    </div>
  );
};

export default Connections;
