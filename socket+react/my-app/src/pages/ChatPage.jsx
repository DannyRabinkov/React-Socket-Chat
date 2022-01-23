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
  const [privateUserName, setPrivateUserName] = useState();
  const [prvMsgLst, setPrvMsgLst] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [privateMessageList, setPrivateMessageList] = useState([]);

  const prevTypingState = usePrevious(isTyping);
  const prevUser = usePrevious(privateMsg);

  const cancelTyping = debounce(() => setIsTyping(false));

  const scrollDown = () => {
    let objDiv = document.getElementById("og-chat-body");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  const deleteElementFromArr = () => {
    if (userIn.length > 0) {
      let temp = userIn.slice();
      temp.splice(0, 1);
      setUserIn(temp);
    }
  };

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
    props.socket.on("receive_privMsg", (data) => {
      console.log("new prv msg", data);
      setPrivateMessageList((list) => [...list, data]);
      scrollDown();
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      scrollDown();
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("login_message", (data) => {
      setUserIn((list) => [...list, data]);
    });
  }, [props.socket]);

  useEffect(() => {
    let timer = setTimeout(deleteElementFromArr, 5000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    props.socket.on("logout_message", (data) => {
      setUserIn((list) => [...list, data]);
    });
  }, [props.socket]);

  return (
    <div className="chat-page">
      <div className="chat-window">
        <div className="chat-header">
          <p>{props.room}</p>
          <button className="logBtn" onClick={logOut}>
            LogOut
          </button>
        </div>
        <div id="og-chat-body" className="chat-body">
          <div>
            {userIn.map((userloged) => {
              return (
                <ul key={Math.random().toString(36).substr(2, 9)}>
                  {userloged}
                </ul>
              );
            })}
          </div>
          {privateMsg && (
            <PrivateMsgCont
              privateList={privateMessageList}
              privateMsg={privateMsg}
              prvLst={(privateMessageList) =>
                setPrivateMessageList(privateMessageList)
              }
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
                hidden={privateMsg ? "hidden" : ""}
              >
                {messageContent.username} {messageContent.time}
                <li>{messageContent.message}</li>
              </ul>
            );
          })}
        </div>
        <form
          id="chat-footer"
          onSubmit={(e) => {
            e.preventDefault();
            scrollDown();
          }}
        >
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
      <UserCont
        isPrivate={privateMessageList}
        isNotPrivate={(privateMessageList) =>
          setPrivateMessageList(privateMessageList)
        }
        socket={props.socket}
        privMsg={(privateMsg) => setPrivateMsg(privateMsg)}
        privMsgUser={privateMsg}
        // privateName={(privateUserName) => setPrivateUserName(privateUserName)}
        // prevPrivMsgUser={prevUser}
      />
    </div>
  );
}

export default ChatPage;
