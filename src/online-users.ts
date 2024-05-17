/**  Custom room online users stream, which is a stream that contains all online users in room with room name as subject. */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
const onlineUsersStreamId: nkruntime.Stream = {
    mode: 205,
}

/**
 * Join the online users stream.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
function rpcJoinOnlineUsersStream(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const hidden: boolean = false;
    const persistence: boolean = true;
    nk.streamUserJoin(ctx.userId, ctx.sessionId, onlineUsersStreamId, hidden, persistence);
    return JSON.stringify({ status: 'success' });
}

/**
 * Get all online users by getting all users in online users stream.
 */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
function rpcGetOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    // Acts as hashmap that checks if a user is online
    const onlineUserIds: { [key: string]: { id: string, username: string } } = {};
    // Presence means the user is online
    const presences = nk.streamUserList(onlineUsersStreamId);
    logger.info(`presences: ${JSON.stringify(presences)}`);
    // I am not sure about the type of presence, so I use any type for now
    presences?.forEach((presence : any) => {
        onlineUserIds[presence.userId] = { 
            id: presence.userId, 
            username: presence.username };
    });
    
    return JSON.stringify(onlineUserIds);
}

/**
  * Count all online users by getting all users in online users stream.
  */
// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
function rpcCountOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const presences = nk.streamUserList(onlineUsersStreamId);
    return presences.length.toString();
}