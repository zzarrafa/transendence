const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getMessagesForRoom(roomId: number) {
    const response = await fetch(`${apiUrl}message/room/${roomId}`);
    const data = await response.json();
    console.log("data: ", data);
    return data;
}

export {
    getMessagesForRoom,
}