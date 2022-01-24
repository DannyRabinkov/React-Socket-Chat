import React, { useState } from "react";
import Button from "react-bootstrap/Button";

function HomePage(props) {
  const [isSubmit, setSubmit] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const joinUser = (username, room) => {
    localStorage.setItem("user", username);
    props.socket.auth = { username, room };
    props.socket.connect();
    // const users = [];
    // users.push({ username, room });
    // console.log(users);
    props.socket.emit("joinRoom", roomInput);
    props.room(roomInput);
    // return users;
  };

  const onMessageSubmit = () => {
    joinUser(nameInput, roomInput);
  };

  return (
    <>
      <form
        id="nickForm"
        onSubmit={(e) => {
          e.preventDefault();
          props.signed(isSubmit);
          onMessageSubmit();
        }}
      >
        <label>Enter a nickname: </label>
        <input
          className="mb-3"
          id="nickname"
          name="username"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
            /* e.preventDefault(); */
          }}
        />
        <br />
        <label>Room: </label>
        <select
          className="mb-3"
          name="room"
          value={roomInput}
          onChange={(e) => {
            setRoomInput(e.target.value);
            /* e.preventDefault(); */
          }}
        >
          <option value="">Choose a room</option>
          <option value="SwitchQ">SwitchQ</option>
          <option value="Fun">Fun</option>
          <option value="Managers">Managers</option>
        </select>
        <br />
        <Button
          id="nick-btn"
          type="submit"
          onClick={() => {
            setSubmit(true);
          }}
        >
          submit!
        </Button>
      </form>
    </>
  );
}

export default HomePage;
