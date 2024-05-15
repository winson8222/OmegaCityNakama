// Custom online users stream, which is a stream that contains all online users
const onlineUsersStreamId: nkruntime.Stream = {
    mode: 200,
}

function rpcJoinOnlineUsersStream(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const hidden: boolean = false;
    const persistence: boolean = true;
    // Log the input context and parameters
    logger.info(`ctx.userId: ${ctx.userId}`);
    logger.info(`ctx.sessionId: ${ctx.sessionId}`);
    // logger.info(`onlineUsersStreamId: ${JSON.stringify(onlineUsersStreamId)}`);
    // logger.info(`hidden: ${hidden}`);
    // logger.info(`persistence: ${persistence}`);
    logger.info("stream count: ", Number(nk.streamCount(onlineUsersStreamId)));
    nk.streamUserJoin(ctx.userId, ctx.sessionId, onlineUsersStreamId, hidden, persistence);
    logger.info("stream count: ", Number(nk.streamCount(onlineUsersStreamId)));
    logger.info("User presence", nk.streamUserGet(ctx.userId, ctx.sessionId, onlineUsersStreamId));
    logger.info("presences", JSON.stringify(nk.streamUserList(onlineUsersStreamId)));
    return JSON.stringify({ status: 'success' });
}

// This unused rpc function is supposed to return the list of online users
// nk.streamUserList is supposed to be used to get the list of users in the online users stream
// However, the function does not work properly for some strange reason. It only returns an empty array
// even though the stream has users in it.
// Instead, retrieving the users in the online users stream is done in the next-omegacity client side 
function rpcGetOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    // Acts as hashmap that checks if a user is online
    const onlineUserIds: { [key: string]: boolean } = {};
    // Presence means the user is online
    const presences = nk.streamUserList(onlineUsersStreamId);
    logger.info(`presences: ${JSON.stringify(presences)}`);
    presences?.forEach(presence => {
        onlineUserIds[presence.userId] = true;
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