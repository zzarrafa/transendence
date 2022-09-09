import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getUserById } from "../../services/user";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { io, Socket } from "socket.io-client";
import moment from "moment";
import { IMessage, IRoom, IUser } from '../../commun/types';



const Profile = () => {
    const router = useRouter()
    const userId = parseInt(router.query.id as string, 10)
    const [user, setUser] = useState<IUser>();
    const [showForm, setShowForm] = useState(false)
    const [message, setMessage] = useState("");
    const [connectUserId, setConnectUserId] = useState(1);
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
            // get all DM ROOMS
            // socket.on("")
            socket.on("messages", (data) => {
                setMessages((messages) => {
                    return {
                        ...messages,
                        [data.room]: data.messages,
                    };
                });
            });
            socket.on("createdRoom", (room) => {
                console.log("createdRoom:", room)
                setRoom(room.id);
            });
        }
    }, [socket]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setConnectUserId(user.id);
    }, []);

    useEffect(() => {
        if (userId) {
            getUserById(userId).then((data) => {
                setUser(data);
            });
        }
    }, [userId]);

    const sendMessage = () => {
        setShowForm(true);
    }
    useEffect(()=> {
        if (room) {
            socket!.emit("createMessage", {
                room: room.id,
                content: message,
                creatorId: connectUserId,
            });
        }
    }, [room])

    const createMessage = (e: any) => {
        e.preventDefault();
        const data = {
            room: {
                name: "DM_3",
                users: [userId],
                type: "DM",
                isPrivate: true,
                password: "",
            },
            creatorId: connectUserId,
        };
        // first time
        socket!.emit("createRoom", data);
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
            {user && (
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
                        <p>{user ? user.name : ""}</p>
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
            )}
        </Box>
    );
}

export default Profile;