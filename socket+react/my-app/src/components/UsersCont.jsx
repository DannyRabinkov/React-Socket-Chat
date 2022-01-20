import React, { useState, useEffect } from "react";

function UserCont(props) {
  const [toPrivMsg, setToPrivMsg] = useState();
  const [showUsers, setShowUsers] = useState([]);

  const username = props.socket.auth.username;

  const selectUser = (user) => {
    const state = props.privMsgUser === user.username ? false : user.username;
    props.privMsg(state);
  };

  useEffect(async () => {
    await props.socket.on("show_users", (data) => {
      setShowUsers(data);
    });
  }, [props.socket, showUsers]);

  return (
    <>
      <div className="allUsersCont">
        <h2>Users In</h2>
        <div className="usersLogedIn">
          {showUsers
            .filter((user) => user.username !== username)
            .map((user) => {
              return (
                <ul
                  id="user"
                  key={Math.random().toString(36).substr(2, 9)}
                  onClick={() => selectUser(user)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="msgAlers">count</span>
                  <strong>{user.username}</strong>
                  <span style={{ color: "black" }}>
                    {user.typing ? " is typing..." : ""}
                  </span>
                </ul>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default UserCont;
