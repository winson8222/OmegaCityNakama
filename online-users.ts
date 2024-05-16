// Custom room online users stream, which is a stream that contains all online users in room with room name as subject
const onlineUsersStreamId: nkruntime.Stream = {
    mode: 205,
}

function rpcJoinOnlineUsersStream(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const hidden: boolean = false;
    const persistence: boolean = true;
    nk.streamUserJoin(ctx.userId, ctx.sessionId, onlineUsersStreamId, hidden, persistence);
    return JSON.stringify({ status: 'success' });
}

// This unused rpc function is supposed to return the list of online users
// nk.streamUserList is supposed to be used to get the list of users in the online users stream
// However, the function does not work properly for some strange reason. It only returns an empty array
// even though the stream has users in it.
// Instead, retrieving the users in the online users stream is done in the next-omegacity client side 
function rpcGetOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    // Acts as hashmap that checks if a user is online
    const onlineUserIds: { [key: string]: { id: string, username: string } } = {};
    // Presence means the user is online
    const presences = nk.streamUserList(onlineUsersStreamId);
    logger.info(`presences: ${JSON.stringify(presences)}`);
    presences?.forEach(presence => {
        onlineUserIds[presence.userId] = { 
            id: presence.userId, 
            username: presence.username };
    });
    
    return JSON.stringify(onlineUserIds);
}

// Like rpcGetOnlineUsers, this function is also unused
// rpcCountOnlineUsers is supposed to return the number of users in the online stream
// However, it does not work properly. It always returns 0 even though the stream has users in it
// as nk.streamUserList always returns an empty array
function rpcCountOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const presences = nk.streamUserList(onlineUsersStreamId);
    return presences.length.toString();
}