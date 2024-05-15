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

function rpcCountOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const presences = nk.streamUserList(onlineUsersStreamId);
    return presences.length.toString();
}