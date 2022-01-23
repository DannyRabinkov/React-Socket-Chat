import React, { useState, useEffect, useRef } from "react";

// function usePrevious(value) {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

function UserCont(props) {
  const [showUsers, setShowUsers] = useState([]);
  const [isTime, setIsTime] = useState();
  const username = props.socket.auth.username;

  // const prevUser = usePrevious(props.privMsgUser);

  const selectUser = (user) => {
    // console.log(user.username, prevUser, user === prevUser);
    // const state = props.privMsgUser === user.username ? false : user.username;
    const userState = props.privMsgUser === user.username ? "" : user.username;
    props.privMsg(userState);
    setIsTime(+new Date());
    console.log("prevPrivMsgUser", props.privMsgUser);
    // if (!props.privMsgUser) {
    //   props.isNotPrivate([]);
    //   console.log(isTime);
    // }
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
                  <span className="msgAlerts">
                    {
                      props.isPrivate.filter((msg) => msg.from == user.username)
                        .length
                    }
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
