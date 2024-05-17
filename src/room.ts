interface Room {
    roomName: string
}

function isRoom(obj: any): obj is Room {
    return 'roomName' in obj;
}

/**
 * Get the stream ID of a room.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
function getRoomStreamId(room: Room): nkruntime.Stream {
    return {
        mode: 205,
        label: room.roomName
    }
}

/**
 * Join the room stream as online user.
 * This means the user is visible to other users in the room.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
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

/**
 * Join the room stream as offline user.
 * This means the user is not visible to other users in the room.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
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

/**
 * Get all online users in a room by getting all users in the room stream that are not hidden.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
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
    // I am not sure about the type of presence, so I use any type for now
    presences?.forEach((presence : any) => {
        roomOnlineUserIds[presence.userId] = {
            id: presence.userId,
            username: presence.username
        }
    });
    
    return JSON.stringify(roomOnlineUserIds);
}

/**
 * Count all online users in a room by getting all users in the room stream that are not hidden.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
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