import React, { useState, useEffect, useRef } from "react";
import PrivateMsgCont from "../components/PrivateMsgCont";
import UserCont from "../components/UsersCont";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

var debounceTimeout;
function debounce(func, wait = 2000, immediate = false) {
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(function () {
      debounceTimeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !debounceTimeout) func.apply(context, args);
  };
}

function ChatPage(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userIn, setUserIn] = useState([]);
  const [privateMsg, setPrivateMsg] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const prevTypingState = usePrevious(isTyping);

  const cancelTyping = debounce(() => setIsTyping(false));

  const startTyping = () => {
    setIsTyping(true);
    cancelTyping();
  };

  useEffect(() => {
    if (prevTypingState != isTyping) {
      if (isTyping) {
        console.log("send typing");
        props.socket.emit("typing", true);
      } else props.socket.emit("typing", false);
    }
  }, [isTyping]);

  const logOut = () => {
    localStorage.getItem("user");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: props.room,
        username: localStorage.getItem("user"),
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await props.socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    props.socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("login_message", (data) => {
      setUserIn((list) => [...list, data]);
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("logout_message", (data) => {
      setUserIn((list) => [...list, data]);
    });
  }, [props.socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{props.room}</p>
        <button className="logBtn" onClick={logOut}>
          LogOut
        </button>
      </div>

      <UserCont
        socket={props.socket}
        privMsg={(privateMsg) => setPrivateMsg(privateMsg)}
        privMsgUser={privateMsg}
      />

      <div>
        {userIn.map((userloged) => {
          return (
            <ul key={Math.random().toString(36).substr(2, 9)}>{userloged}</ul>
          );
        })}
      </div>

      <div className="chat-body">
        {privateMsg && (
          <PrivateMsgCont
            privateMsg={privateMsg}
            socket={props.socket}
            to={props.room}
            startTyping={startTyping}
          />
        )}
        {messageList.map((messageContent) => {
          return (
            <ul
              key={Math.random().toString(36).substr(2, 9)}
              className="message-meta"
            >
              {messageContent.username} {messageContent.time}
              <li>{messageContent.message}</li>
            </ul>
          );
        })}
      </div>
      <form id="chat-footer" onSubmit={(e) => e.preventDefault()}>
        <input
          onKeyDown={startTyping}
          id="input"
          value={currentMessage}
          placeholder="..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          autoComplete="off"
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
