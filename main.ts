function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
    initializer.registerRpc('users', rpcUsers);
    initializer.registerRpc('healthcheck', rpcHealthCheck);
    initializer.registerRpc('echo', rpcEcho);
    initializer.registerRpc('send_notification', rpcSendNotification);
    initializer.registerRpc('join_online_users_stream', rpcJoinOnlineUsersStream);
    initializer.registerRpc('count_online_users', rpcCountOnlineUsers);
    initializer.registerRpc('get_online_users', rpcGetOnlineUsers);
    logger.info('JavaScript logic loaded.');
}