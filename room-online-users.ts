interface Room {
    roomName: string
}

function isRoom(obj: any): obj is Room {
    return 'roomName' in obj;
}

function getRoomStreamId(room: Room): nkruntime.Stream {
    return {
        mode: 205,
        label: room.roomName
    }
}


function rpcJoinRoomStreamAsOnline(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isRoom(json)) {
        return JSON.stringify({ error: "Invalid room format" });
    }
    const room = (json as Room);
    const roomStreamId = getRoomStreamId(room);

    const hidden: boolean = false;
    const persistence: boolean = true;
    
    nk.streamUserLeave(ctx.userId, ctx.sessionId, roomStreamId);
    nk.streamUserJoin(ctx.userId, ctx.sessionId, roomStreamId, hidden, persistence);
    return JSON.stringify({ status: 'success' });
}

function rpcJoinRoomStreamAsOffline(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isRoom(json)) {
        return JSON.stringify({ error: "Invalid room format" });
    }
    const room = (json as Room);
    const roomStreamId = getRoomStreamId(room);

    const hidden: boolean = true;
    const persistence: boolean = true;
    
    nk.streamUserJoin(ctx.userId, ctx.sessionId, roomStreamId, hidden, persistence);
    return JSON.stringify({ status: 'success' });
}

// This unused rpc function is supposed to return the list of online users
// nk.streamUserList is supposed to be used to get the list of users in the online users stream
// However, the function does not work properly for some strange reason. It only returns an empty array
// even though the stream has users in it.
// Instead, retrieving the users in the online users stream is done in the next-omegacity client side 
function rpcGetOnlineUsersInRoom(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isRoom(json)) {
        return JSON.stringify({ error: "Invalid room format" });
    }
    const room = (json as Room);
    const roomStreamId = getRoomStreamId(room);
    // Acts as hashmap that checks if a user is online
    const roomOnlineUserIds: { [key: string]: { id: string, username: string } } = {};
    // Presence means the user is online
    const presences = nk.streamUserList(roomStreamId, false);
    logger.info(`presences: ${JSON.stringify(presences)}`);
    presences?.forEach(presence => {
        roomOnlineUserIds[presence.userId] = {
            id: presence.userId,
            username: presence.username
        }
    });
    
    return JSON.stringify(roomOnlineUserIds);
}

// Like rpcGetOnlineUsers, this function is also unused
// rpcCountOnlineUsers is supposed to return the number of users in the online stream
// However, it does not work properly. It always returns 0 even though the stream has users in it
// as nk.streamUserList always returns an empty array
function rpcCountRoomOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isRoom(json)) {
        return JSON.stringify({ error: "Invalid room format" });
    }
    const room = (json as Room);
    const roomStreamId = getRoomStreamId(room);
    const presences = nk.streamUserList(roomStreamId, false);
    return presences.length.toString();
}