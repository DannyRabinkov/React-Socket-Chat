import React, { useState, useEffect } from "react";

function PrivateMsgCont(props) {
  const [currentPrivateMessage, setCurrentPrivateMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [privateMessageList, setPrivateMessageList] = useState([]);

  const username = props.socket.auth.username;
  const privateWith = props.privateMsg;

  const sendPrivateMessage = async () => {
    // props.socket.on("user_private", (data) => {
    //   setUserPriv(data);
    // });
    if (currentPrivateMessage !== "") {
      const messageData = {
        from: username,
        to: privateWith,
        message: currentPrivateMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await props.socket.emit("send_private_message", messageData);
      setPrivateMessageList((list) => [...list, messageData]);
      setCurrentPrivateMessage("");
    }
  };

  useEffect(() => {
    props.socket.on("show_users_inChat", (data) => {
      setUserList((list) => [...list, data]);
    });
  }, [userList]);

  useEffect(() => {
    props.socket.on("receive_privMsg", (data) => {
      setPrivateMessageList((list) => [...list, data]);
    });
  }, [props.socket]);

  return (
    <div
      className="privateMsgWindow"
      style={{
        position: "absolute",
        width: "350px",
        height: "450px",
        border: "solid #000 1px",
        marginLeft: 550,
      }}
    >
      <h1>{privateWith}</h1>
      <div className="privateMsgHeader">{props.socket.username}</div>
      <div className="priateMsgBody">
        {privateMessageList.map((messageContent) => {
          return (
            <ul
              key={Math.random().toString(36).substr(2, 9)}
              className="message-meta"
            >
              {messageContent.from} {messageContent.time}
              <li>{messageContent.message}</li>
            </ul>
          );
        })}
      </div>
      <form id="privateMsgFooter" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Hey..."
          value={currentPrivateMessage}
          className="input"
          onChange={(event) => {
            setCurrentPrivateMessage(event.target.value);
          }}
        />
        <button onClick={sendPrivateMessage}>Send</button>
      </form>
    </div>
  );
}

export default PrivateMsgCont;
