import React, { useState, useEffect, useRef } from "react";

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

function UserCont(props) {
  const [showUsers, setShowUsers] = useState([]);
  const [isTime, setIsTime] = useState({});
  const [newMsg, setNewMsg] = useState({});
  const username = props.socket.auth.username;

  const selectUser = (user) => {
    const userState = props.privMsgUser === user.username ? "" : user.username;
    props.privMsg(userState);
    setIsTime((isTime) => {
      isTime[props.privMsgUser] = +new Date();
      isTime[user.username] = +new Date();
      return isTime;
    });
  };

  useEffect(() => {
    setPrivateMsgsCounts();
  }, [props.isPrivate, props.privMsg]);

  function setPrivateMsgsCounts() {
    let newMsgsObj = groupBy(props.isPrivate, "from");
    for (const user in newMsgsObj) {
      newMsgsObj[user] = newMsgsObj[user].filter((msg) => {
        console.log("user", user);
        console.log("msg", msg);
        // return msg;
        return (
          msg.timestamp > (isTime[user] || 0) && props.privMsgUser !== user
        );
      }).length;
    }
    console.log("newMsgsObj", newMsgsObj);
    setNewMsg(newMsgsObj);
  }

  useEffect(async () => {
    await props.socket.on("show_users", (data) => {
      setShowUsers(data);
    });
  }, [props.socket, showUsers]);

  return (
    <>
      <div className="allUsersCont">
        <h2 className="mt-4" style={{ fontFamily: "serif", fontWeight: 700 }}>
          Users In
        </h2>
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
                  <span className="msgAlerts" hidden={!newMsg[user.username]}>
                    {newMsg[user.username]}
                  </span>
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
