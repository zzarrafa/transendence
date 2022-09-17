import { IRoom } from "../../commun/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function createRoom(room: IRoom, creatorId: number) {
    const response = await fetch(`${apiUrl}room/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room, creatorId })
    });
    const data = await response.json();
    console.log("createRoom", data);
    return data;
}

async function getRoomById(roomId: number) {
    const response = await fetch(`${apiUrl}room/${roomId}`);
    const data = await response.json();
    console.log("getRoomById", data);
    return data;
}

async function getRoomsForUser(userId: number) {
    const response = await fetch(`${apiUrl}membership/rooms/${userId}`);
    const data = await response.json();
    console.log("getRoomsForUser", data);
    return data;
}

async function getMembers(roomId: number) {
    const response = await fetch(`${apiUrl}membership/members/${roomId}`);
    const data = await response.json();
    console.log("getMembers", data);
    return data;
}

async function banUser(roomId: number, userId: number) {
    const response = await fetch(`${apiUrl}membership/ban`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, userId })
    });
    const data = await response.json();
    console.log("banUser", data);
    return data;
}

export {
    getRoomsForUser,
    createRoom,
    getRoomById,
    getMembers,
    banUser
}