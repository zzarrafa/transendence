import { useState, useEffect } from "react";
import { Button, Input, OutlinedInput,InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import { form } from 'formik'
import { Box } from "@mui/system";
import React from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  sender: string;
  room: string;
  content: string;
  time: Date;
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "swi3ida",
  "swimi",
  "hamza",
  "mohammed",
];

const user = "souad";
const socket = io("http://localhost:8000/chat");


function Chat() {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [status, setStatus] = useState("Join");
  const [showForm, setShowForm] = useState(false);
  const [room, setRoom] = useState("");
  const [room_array, setRoomArray] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState<{ [key: string]: boolean}>({});
  const [personName, setPersonName] = React.useState<string[]>([]);

  useEffect(() => {
    socket.on("chatToClient", (data: Message) => {
      setMessages((messages) => {
        messages[data.room].push(data);
        return messages;
      });
    });
  
    socket.on('joinedRoom', (room: string) => {
      console.log('joinedRoom');
      setRooms({ ...rooms, [room]: true });
  
    });
  
    socket.on('createdRoom', (room: string) => {
        setRooms({ ...rooms, [room]: true });
  
    });
  
    socket.on('leftRoom', (room: string) => {
      console.log('leftRoom');
        setRooms({ ...rooms, [room]: false });
    });
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const { target: { value },} = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("chatToServer", {
      sender: user,
      room: activeRoom,
      content: message,
      time: new Date(),
    });
    setMessage("");
  };

  const toggleVisibility = () => {
    setShowForm(!showForm);
  };

  const isMemberOfActiveRoom = () => {
    return rooms[activeRoom];
  }
  const toggleRoomMembership = () => {
    if (isMemberOfActiveRoom()) {
      socket.emit("leaveRoom", { user, room: activeRoom });
      setStatus("Join");
    }
    else {
      socket.emit("joinRoom", { user, room: activeRoom });
      setStatus("Leave");
    }
  };
 
  const createRoom = (e: any) => {
    e.preventDefault();
    socket.emit("createRoom", room);
    setRoomArray([...room_array, room]);
    setRoom("");
    setShowForm(false);
    setMessages({ ...messages, [room]: [] });
  };

  const handleClickRoom = (room:string) => {
    setActiveRoom(room);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "1024px",
      }}
    >
      <h1>Chat</h1>
      <Box>
        <div style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          <Button variant="contained" onClick={toggleVisibility}>Create Room</Button>
          <Button variant="contained" onClick={toggleRoomMembership}> {status} </Button>
        </div>
      </Box>
      <form
        onSubmit={(e) => createRoom(e)}
        style={{ display: showForm ? "flex" : "none", flexDirection: "column" }}
      >
        <Input
          type='text'
          placeholder='Room Name'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id='demo-multiple-name-label'>Name</InputLabel>
            <Select
              labelId='demo-multiple-name-label'
              id='demo-multiple-name'
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label='Name' />}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button type="submit" variant="contained">Create</Button>
      </form>
      <h1>Rooms</h1>
      <Box>
        <div id='rooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {room_array.map((room: any) => {
            return (
              <Button
                variant={activeRoom === room ? "contained" : "outlined"}
                color= "secondary"
                key={room}
                onClick={() => handleClickRoom(room)}
              >
                {room}
              </Button>
            );
          })}
        </div>
      </Box>
      <Box>
        <Box>
          <ul id='messages'>
            {messages[activeRoom] &&
              messages[activeRoom].map((msg: Message, index) => {
                return (
                  <li key={index}>
                    <b>{msg.sender}</b> : {msg.content} <span>{msg.time.toString()}</span>
                  </li>
                );
              })}
          </ul>
        </Box>
        <Box>
          <form onSubmit={(e) => sendMessage(e)}>
            <Input
              type='text'
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginRight: "5px" }}
            />
            <Button type='submit' onClick={sendMessage} variant="contained">
              Send
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
