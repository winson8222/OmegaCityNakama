function rpcJoinOnlineUsersStream(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const onlineUsersStreamId: nkruntime.Stream = {
        mode: 1000,
        label: "Online Users",
    }
    const hidden: boolean = true;
    const persistence: boolean = false;
    // Log the input context and parameters
    // logger.info(`ctx.userId: ${ctx.userId}`);
    // logger.info(`ctx.sessionId: ${ctx.sessionId}`);
    // logger.info(`onlineUsersStreamId: ${JSON.stringify(onlineUsersStreamId)}`);
    // logger.info(`hidden: ${hidden}`);
    // logger.info(`persistence: ${persistence}`);
    nk.streamUserJoin(ctx.userId, ctx.sessionId, onlineUsersStreamId, hidden, persistence);
    return JSON.stringify({ status: 'success' });
}