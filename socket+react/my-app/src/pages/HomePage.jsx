import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function HomePage(props) {
  const [isSubmit, setSubmit] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const joinUser = (username, room) => {
    localStorage.setItem("user", username);
    props.socket.auth = { username, room };
    props.socket.connect();
    props.socket.emit("joinRoom", roomInput);
    props.room(roomInput);
  };

  const onMessageSubmit = () => {
    joinUser(nameInput, roomInput);
  };

  return (
    <>
      <form
        className="justify-content-center"
        id="nickForm"
        onSubmit={(e) => {
          e.preventDefault();
          props.signed(isSubmit);
          onMessageSubmit();
        }}
      >
        <Form.Label>Enter a nickname: </Form.Label>
        <input
          style={{ width: "35%" }}
          className="m-3"
          id="nickname"
          name="username"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
            /* e.preventDefault(); */
          }}
        />
        <br />
        <Form.Label>Room: </Form.Label>
        <select
          style={{ width: "25%" }}
          className="m-2"
          name="room"
          value={roomInput}
          onChange={(e) => {
            setRoomInput(e.target.value);
            /* e.preventDefault(); */
          }}
        >
          <option>Choose a room</option>
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
