import { IRoom } from "../../commun/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getRoomsForUser(userId: number) {
    const response = await fetch(`${apiUrl}room/${userId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function createRoom(room: IRoom, creatorId: number) {
    const response = await fetch(`${apiUrl}room/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room, creatorId })
    });
    const data = await response.json();
    return data;
}


export {
    getRoomsForUser,
    createRoom
}