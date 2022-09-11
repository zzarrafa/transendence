import { useState, useEffect } from "react";
import { Button, TextField, OutlinedInput,InputLabel, MenuItem, FormControl, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/system";
import React from "react";
import { io, Socket } from "socket.io-client";
import { getAllUsers, getUserByUsername } from "../../services/user";
import { IRoom, IUser, IMessage } from "../../commun/types";
import { getMessagesForRoom } from "../../services/message";
import moment from "moment";
import Search from "../../commun/search";

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
  const [messages, setMessages] = useState<{ [key: number]: IMessage[] }>({});
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<IRoom>();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userRooms, setUserRooms] = useState<IRoom[]>([]);
  const [connectUserId, setConnectUserId] = useState(1);
  const [allRooms, setAllRooms] = useState<IRoom[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [showRoomContent, setShowRoomContent] = useState(false);
  const [dmRooms, setDmRooms] = useState<IRoom[]>([]);
  const [checked, setChecked] = useState(true);
  const [password, setPassword] = useState("")


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
      const nonDmRooms = rooms.filter((room) => {
        return room.type !== "DM";
      })
      setUserRooms(nonDmRooms)
      const dmRooms = rooms.filter((room) => {
          return room.type == "DM"
      })
      setDmRooms(dmRooms);
      });

      socket.on("allRooms", (rooms: IRoom[]) => {
        setAllRooms(rooms);
      });

      socket.on("messages", (data) => {
          setMessages((messages) => {
            return {
              ...messages,
              [data.room]: data.messages,
            };
          });
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

  const createMessage = (e: any) => {
    e.preventDefault();
    if (user) {
      const data = {
        user: user.id,
        room: selectedRoom?.id,
        content: message,
      }
      socket!.emit("createMessage", data);
      setMessage("");
    }
  }

  const toggleVisibility = () => {
    setShowForm(!showForm);
  };

  const JoinRoom = (roomId: number) => {
    socket!.emit("joinRoom", roomId);
  };

  const LeaveRoom = (roomId: number) => {
    socket!.emit("leaveRoom", roomId);
    setSelectedRoom(undefined);
  };
 
  useEffect(() => {
    console.log("Messages:", messages);
  }, [messages]);

  const createRoom = (e: any) => {
    e.preventDefault();
    const data = {
      room: {
        name: roomName,
        users: selectedUsers,
        type: "GROUP",
        isPrivate: checked,
        password: password,
      },
      creatorId: connectUserId,
    };
    socket!.emit("createRoom", data);
    setRoomName("");
    setShowForm(false);
    setSelectedUsers([]);
    setPersonName([]);
    setChecked(true);
    setPassword("");
  };

  const handleClickRoom = (room: IRoom) => {
    setSelectedRoom(room);
    setShowRoomContent(true);
    getMessagesForRoom(room.id).then((data) => {
      setMessages({ ...messages, [room.id]: data });
    });
  };

  const formatTime = (time: string) => {
    return (moment(time).calendar(null, {
      sameDay: 'LT',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: 'dddd',
      sameElse: 'DD/MM/YYYY'
    }))
  };

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  }

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
      <Search></Search>
      <Box sx={{marginTop: "5px"}}>
        <div style={{display: "flex", justifyContent: "space-between", gap: "5px", marginBottom: "10px"}}>
          <Button variant="contained" onClick={toggleVisibility}>Create Room</Button>
        </div>
      </Box>
      <form
        onSubmit={(e) => createRoom(e)}
        style={{ display: showForm ? "flex" : "none", flexDirection: "column" }}
      >
        <TextField
          label="Room Name"
          value={roomName}
          onChange={(e:any) => setRoomName(e.target.value)}
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
        <FormGroup>
          <FormControlLabel control={
            <Checkbox checked={checked}  onChange={handleChangeCheckBox} inputProps={{ 'aria-label': 'controlled' }}/>} label="Private" />
        </FormGroup>
          {/* input fieled for password */}
          <TextField
            id="password"
            label="Password"
            value={password}
            onChange={handleChangePassword}
            style={{ marginBottom: "5px" }}
          />
        <Button type="submit" variant="contained">Create</Button>
      </form>
      <h1>All Rooms</h1>
      <Box>
        <div id='rooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {
            allRooms.map((room: IRoom, index: number ) => {
              return (
                <Box sx={{display: "flex", gap: "5px"}} key={index}>
                    <Button
                      variant= "outlined"
                      color= "secondary"
                      key={room.name}
                    >
                      {room.name}
                    </Button>
                    <Button variant="outlined" onClick={()=> JoinRoom(room.id)}> Join </Button>
                </Box>
              );
            })
          }
        </div>
      </Box>
      <h1>User Rooms (Group)</h1>
      <Box>
        <div id='public_rooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {
            userRooms.map((room: IRoom, index) => {
              return (
                <Box key={index}>
                  <Button
                    variant={selectedRoom?.name === room.name ? "contained" : "outlined"}
                    color= "secondary"
                    key={room.name}
                    onClick={() => handleClickRoom(room)}
                  >
                    {room.name}
                  </Button>
                </Box>
              );
            })
          }
        </div>
      </Box>
      {/* CHAT ROOM */}
      {
        selectedRoom &&
        <Box sx={{
          display: showRoomContent ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid gray",
          padding: "10px",
          margin: "10px",
          width: "50%",
          }}>
          <Box>
            <Button variant="outlined" onClick={()=> LeaveRoom(selectedRoom.id)} > Leave </Button>
            <ul id='messages'>
              
              {messages[selectedRoom.id] &&
                messages[selectedRoom.id].map((msg: IMessage, index) => {
                  return (
                    <li key={index}>
                      <b>{msg.user.username}</b> : {msg.content} <span>{formatTime(msg.createdAt.toString())}</span>
                    </li>
                  );
                })}
            </ul>
          </Box>
          <Box>
            <form onSubmit={(e) => createMessage(e)}>
              <TextField
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
        </Box>
      }
      <h1>DM Rooms</h1>
      <Box>
        <div id='DMrooms' style={{display: "flex", justifyContent: "space-between", gap: "5px"}}>
          {
            dmRooms.map((room: IRoom, index) => {
              return (
                <Box key={index}>
                  <Button
                    variant={selectedRoom?.name === room.name ? "contained" : "outlined"}
                    color= "secondary"
                    key={room.name}
                    onClick={() => handleClickRoom(room)}
                  >
                    {room.name}
                  </Button>
                </Box>
              );
            })
          }
        </div>
      </Box>
    </Box>
  );
}

export default Chat;
