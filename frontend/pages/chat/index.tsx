import { useState, useEffect } from "react";
import { Button, Input, OutlinedInput,InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import { form } from 'formik'
import { Box } from "@mui/system";
import React from "react";
import { io, Socket } from "socket.io-client";
import { getAllUsers, getUserByUsername } from "../../services/user";
import { getRoomsForUser } from "../../services/room";
import { IRoom, IUser } from "../../commun/types";
import { useRouter } from 'next/router';

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


function Chat() {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [status, setStatus] = useState("Join");
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState<{ [key: string]: boolean}>({});
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [update, setUpdate] = useState(0);
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userRooms, setUserRooms] = useState<IRoom[]>([]);
  const [connectUserId, setConnectUserId] = useState(1);
  const [allRooms, setAllRooms] = useState<IRoom[]>([]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(()=> {
    setSocket(io("http://localhost:8000/chat", {
     query:{
       'user': localStorage.getItem('user'),
     }
   }))
  }, [])

  useEffect(()=> {
    if (socket) {
      socket.on("rooms", (rooms: IRoom[]) => {
        console.log("rooms")
        setUserRooms(rooms);
      });

      socket.on("allRooms", (rooms: IRoom[]) => {
        console.log("all rooms")
        setAllRooms(rooms);
      });

      socket.on("chatToClient", (data: Message) => {
        setUpdate((prev) => prev + 1);
        console.log('Chattoclient')
        setMessages((messages) => {
          messages[data.room].push(data);
          return messages;
        });
      });
    
      socket.on('createdRoom', (room: string) => {
          setUpdate((prev) => prev + 1);
          setStatus('Leave');
          setRooms({ ...rooms, [room]: true });
      });
  
      socket.on('joinedRoom', (room: string) => {
        console.log('joinedRoom');
        setRooms({ ...rooms, [room]: true });
    
      });
    
      socket.on('leftRoom', (room: string) => {
        console.log('leftRoom');
          setRooms({ ...rooms, [room]: false });
      });
    }
  }, [socket]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user)
    setConnectUserId(user.id);
  }, []);

  useEffect(() => {
    if (user) {
    getAllUsers().then((data) => {
      const filteredUsers = data.filter((user: IUser) => user.id !== connectUserId);
      setUsers(filteredUsers.map((user: IUser) => user.username));
    });
  }
  }, [user]);

  useEffect(() => {
    if (personName.length > 0) {
      let username = personName[personName.length - 1];
        getUserByUsername(username).then((data) => {
          setSelectedUsers([...selectedUsers, data.id]);
        });
    }
  }, [personName]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const { target: { value },} = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    const data = {
      sender: user!.username,
      room: activeRoom,
      content: message,
      time: new Date(),
    };
    if (isMemberOfActiveRoom()) {
      socket!.emit("chatToServer", data);
    }
    else
      alert('You must join the room before sending messages!');
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
      socket!.emit("leaveRoom", activeRoom);
      setStatus("Join");
    }
    else {
      socket!.emit("joinRoom", activeRoom);
      setStatus("Leave");
    }
  };
 
  const createRoom = (e: any) => {
    e.preventDefault();
    const data = {
      room: {
        name: roomName,
        users: selectedUsers,
      },
      creatorId: connectUserId,
    };
    console.log("socket: ", socket);
    socket!.emit("createRoom", data);
    // setRoomArray([...room_array, roomName]);
    setRoomName("");
    setShowForm(false);
    setMessages({ ...messages, [roomName]: [] });
    setSelectedUsers([]);
    setPersonName([]);
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
      }}
    >
      <h1>Chat</h1>
      {user && (
           <h4>
            Welcome {user.username}
           </h4>
      )}
      <Box sx={{marginTop: "5px"}}>
        <div style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          <Button variant="contained" onClick={toggleVisibility}>Create Room</Button>
          {
            activeRoom != "" && (
            <Button variant="contained" onClick={toggleRoomMembership}> {status} </Button>
            )
          }
        </div>
      </Box>
      <h1>All Rooms</h1>
      <Box>
        <div id='rooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {
            allRooms.map((room: IRoom) => {
              return (
                <Button
                  variant="outlined"
                  color= "secondary"
                  key={room.name}
                  // onClick={() => handleClickRoom(room.name)}
                >
                  {room.name}
                </Button>
              );
            })
          }
        </div>
      </Box>
      
      <form
        onSubmit={(e) => createRoom(e)}
        style={{ display: showForm ? "flex" : "none", flexDirection: "column" }}
      >
        <Input
          type='text'
          placeholder='Room Name'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
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
              {users.map((name) => (
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
      <h1>User Rooms</h1>
      <Box>
        <div id='rooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {
            userRooms.map((room: IRoom) => {
              return (
                <Button
                  variant={activeRoom === room.name ? "contained" : "outlined"}
                  color= "secondary"
                  key={room.name}
                  onClick={() => handleClickRoom(room.name)}
                >
                  {room.name}
                </Button>
              );
            })
          }
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
            <Button type='submit' variant="contained">
              Send
            </Button>
          </form>
        </Box>
        {/* Friends */}
        <h1>Friends</h1>
      </Box>
    </Box>
  );
}

export default Chat;
