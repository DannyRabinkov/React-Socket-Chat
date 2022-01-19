import React, { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import io from "socket.io-client";

let socket = io.connect("http://192.168.1.27:3000", { autoConnect: false });

function App() {
  const [isSigned, setSigned] = useState(false);
  const [isChat, setChat] = useState(true);
  const [isRoom, setRoom] = useState("");

  return (
    <>
      <div className="container">
        {!isSigned && (
          <HomePage
            socket={socket}
            signed={(isSigned) => setSigned(isSigned)}
            room={(isRoom) => setRoom(isRoom)}
          />
        )}
        {isSigned && isChat && <ChatPage socket={socket} room={isRoom} />}
      </div>
    </>
  );
}

export default App;
