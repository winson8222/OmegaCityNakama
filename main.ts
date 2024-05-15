function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
    initializer.registerRpc('users', rpcUsers);
    initializer.registerRpc('healthcheck', rpcHealthCheck);
    initializer.registerRpc('echo', rpcEcho);
    initializer.registerRpc('list_channel_members', listChannelMembers);

    logger.info('JavaScript logic loaded.');
}