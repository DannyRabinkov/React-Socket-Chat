import React, { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import io from "socket.io-client";

let socket = io.connect("http://10.0.0.9:3000/", {
  path: "/my-app",
  autoConnect: false,
});

function App() {
  const [isSigned, setSigned] = useState(false);
  const [isChat, setChat] = useState(true);
  const [isRoom, setRoom] = useState("");

  return (
    <>
      <div className="cont">
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
