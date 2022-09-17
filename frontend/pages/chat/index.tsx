import { useState, useEffect } from "react";
import { Button, TextField, OutlinedInput,InputLabel, MenuItem, FormControl, Checkbox, FormGroup, FormControlLabel, Typography} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/system";
import React from "react";
import { io, Socket } from "socket.io-client";
import { getAllUsers, getUserByUsername } from "../../services/user";
import { IRoom, IUser, IMessage } from "../../commun/types";
import { getMessagesForRoom } from "../../services/message";
import { getMembers, banUser } from "../../services/room";
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
  const [members, setMembers] = useState<{ [key: number]:IUser[]}>({});
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
  const [password, setPassword] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSettings, setShowSettings] = useState<{ [key: number]: boolean }>({});


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
          return room.type === "DM"
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

      socket.on("members", (data) => {
        console.log("MEMBERS", data)
        setMembers((members) => {
          return {
            ...members,
            [data.roomId]: data.members,
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

  const JoinRoom = (room: IRoom) => {
    // setSelectedRoom(room);
    if (room.password && !showPassword) {
      setShowPassword(true)
    } else if (room.password == roomPassword || !room.password) {
      socket?.emit("joinRoom", room.id);
      setShowPassword(false)
    }
    else {
      alert("wrong password")
    }
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

    getMembers(room.id).then((data) => {
      data.users.map((member: IUser) => {
        setShowSettings((showSettings) => {
          return {
            ...showSettings,
            [member?.id]: false,
          };
        });
      });

      setMembers((members) => {
        return {
          ...members,
          [room.id]: data.users,
          };
      });
    });

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

  const [selectedMember, setSelectedMember] = useState<IUser>()

  const handleClickMember = (member: IUser) => {
    setSelectedMember(member)
    setShowSettings((showSettings) => {
      return {
        ...showSettings,
        [member?.id]: true,
      };
    });
    }
  const [toggleMuteTime, setToggleMuteTime] = useState(false);
  const [muteTime, setMuteTime] = useState(0);

  // ban user (for always)
  const banUser = () => {
    if (selectedMember) {
      socket!.emit("banUser", {roomId: selectedRoom?.id, userId: selectedMember.id })
    }
  }
  // mute user (he can not see messages until a limited time)
  const muteUser = () => {
    setToggleMuteTime(true)
    if (selectedMember) {
      socket!.emit("muteUser", {roomId: selectedRoom?.id, userId: selectedMember.id, duration: muteTime})
    }
  }

  const timeOptions = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
  ];
  const setAdmin = () => {
    console.log("selectedMember", selectedMember)
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
                    <Button variant="contained" onClick={() => JoinRoom(room)}>Join</Button>
                </Box>
              );
            })
          }
        </div>
        <div>
          {
              showPassword && selectedRoom && (
                <form style={{marginTop: "10px"}}>
                  <TextField id="password" label="Password" value={roomPassword}
                    onChange={(e:any) => setRoomPassword(e.target.value)} />
                  <Box sx={{display: "flex", gap: "5px", marginTop: "10px"}}>
                    <Button variant="contained" onClick={() => JoinRoom(selectedRoom)}>Join</Button>
                    <Button variant="contained" onClick={() => setShowPassword(false)}>Cancel</Button>
                  </Box>
                </form>
              )
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
          justifyContent: "space-between",
          border: "1px solid gray",
          padding: "10px",
          margin: "10px",
          width: "60%",
          }}>
            <Box >
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
          <Box>
            <h3>Members</h3>
            <ul>
              {members[selectedRoom.id] &&
                members[selectedRoom.id].map((member: IUser, index) => {
                  return (
                    <li key={index} onClick={()=> handleClickMember(member)} 
                      style={{border: (selectedMember && selectedMember.username === member.username) ? "1px solid red" : "1px solid"}}>
                      <b>{member.username}</b>
                    </li>
                  );
                })}
            </ul>
            {
               selectedMember && showSettings[selectedMember.id] && (
                <Box>
                  <Box sx={{}}>
                    <Typography variant="h5"> {selectedMember.username} </Typography>
                    <Button variant="outlined" onClick={banUser}>Ban</Button>
                    <Button variant="outlined" onClick={muteUser}>Mute</Button>
                    <Button variant="outlined" onClick={setAdmin}>Set Admin</Button>
                  </Box>
                  {
                    toggleMuteTime && (
                      <Select value={muteTime} onChange={(e)=> setMuteTime(Number(e.target.value))}>
                      {
                        timeOptions.map((timeOption: any) => {
                          return (
                            <MenuItem value={timeOption.value}>{timeOption.label}</MenuItem>
                          );
                        })
                      }
                    </Select>
                    )
                  }
                </Box>
               )
            }
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
