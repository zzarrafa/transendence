import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getUserById } from "../../services/user";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { io, Socket } from "socket.io-client";
import moment from "moment";
import { IMessage, IRoom, IUser } from '../../commun/types';
import { getRoomsForUser } from '../../services/room';
import { getMessagesForRoom }  from '../../services/message'



const Profile = () => {
    const router = useRouter()
    const userId = parseInt(router.query.id as string, 10)
    const [user, setUser] = useState<IUser>();
    const [showForm, setShowForm] = useState(false)
    const [message, setMessage] = useState("");
    const [connectedUserId, setConnectedUserId] = useState(1);
    const [socket, setSocket] = useState < Socket > ();
    const [messages, setMessages] = useState<{ [key: number]: IMessage[] }>({});
    const [room, setRoom] = useState<IRoom>();

    useEffect(() => {
        setSocket(io("http://localhost:8000/chat", {
            query: {
                'user': localStorage.getItem('user'),
            }
        }))
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on("messages", (data) => {
                console.log("------> room: ", room);
                if (room && data.room == room.id) {
                    setMessages((messages) => {
                        return {
                            ...messages,
                            [data.room]: data.messages,
                        };
                    });
                }
            });
            socket.on("createdRoom", (room) => {
                if (room.name == "DM"+connectedUserId+"-"+userId && room.type == "DM" ) {
                    console.log("create ROOM then create message")
                    setRoom(room);
                }
            });
        }
    }, [socket, room]);

    useEffect(()=> {
        if (userId) {
            getUserById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [userId])

    useEffect(() => {
        const tmpUser = JSON.parse(localStorage.getItem('user') || '{}');
        setConnectedUserId(tmpUser.id);
        getRoomsForUser(tmpUser.id).then((rooms) => {
            const dmRooms = rooms.filter((room: IRoom) => room.type === "DM");
            const tmpRoom = dmRooms.find((room: IRoom) => {
                // @ts-ignore
                return room.users.find((user: IUser) =>  user.id === userId);
            });
            if (tmpRoom && showForm) {
                console.log("rooom already exist:)")
                getMessagesForRoom(tmpRoom.id).then((data) => {
                    setMessages((messages) => {
                        return {
                            ...messages,
                            [tmpRoom.id]: data,
                            };
                        });
                });
                setRoom(tmpRoom);
            }
        });
    }, [showForm]);

    useEffect(() => {
        if (room && message) {
            socket!.emit("createMessage", {
                room: room.id,
                content: message,
                user: connectedUserId,
            });
            setMessage("")
        }
    }, [room]);

    const createMessage = (e: any) => {
        e.preventDefault();
        const data = {
            room: {
                name: "DM"+connectedUserId+"-"+userId,
                users: [userId],
                type: "DM",
                isPrivate: true,
                password: "",
            },
            creatorId: connectedUserId,
        };
        if (room === undefined) {
            socket!.emit("createRoom", data);

        }
        else {
            console.log("room:", room)
            socket!.emit("createMessage", {
                room: room.id,
                content: message,
                user: connectedUserId,
            });
            setMessage("")
        }
    }

    const sendMessage = () => {
        setShowForm(true);
    }
    const formatTime = (time: string) => {
        return (moment(time).calendar(null, {
            sameDay: 'LT',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: 'dddd',
            sameElse: 'DD/MM/YYYY'
        }))
    }

    return (
        <Box sx={{ padding: "10px" }}>
            <h1>Profile</h1>
            <h2>{user?.username}</h2>
            <div>
                <div>
                    <ul id='messages'>
                        {room && messages[room.id] &&
                            messages[room.id].map((msg: IMessage, index) => {
                                return (
                                    <li key={index}>
                                        <b>{msg.user.username}</b> : {msg.content} <span>{formatTime(msg.createdAt.toString())}</span>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
                <div className="profile-container">
                    <Button onClick={sendMessage} variant="contained">Message</Button>
                    <form onSubmit={(e) => createMessage(e)} style=
                        {{ display: showForm ? "flex" : "none", gap: "5px", alignItems: "center", marginTop: "10px" }}>
                        <TextField label="Message" variant="outlined"
                            value={message} onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="contained" type='submit' style={{ height: "40px" }}>Send</Button>
                    </form>
                </div>
            </div>
        </Box>
    );
}

export default Profile;