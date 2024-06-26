function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
    initializer.registerRpc('users', rpcUsers);
    initializer.registerRpc('healthcheck', rpcHealthCheck);
    initializer.registerRpc('echo', rpcEcho);
    initializer.registerRpc('send_notification', rpcSendNotification);
    initializer.registerRpc('join_online_users_stream', rpcJoinOnlineUsersStream);
    initializer.registerRpc('count_online_users', rpcCountOnlineUsers);
    initializer.registerRpc('get_online_users', rpcGetOnlineUsers);
    initializer.registerRpc('join_room_as_online', rpcJoinRoomStreamAsOnline);
    initializer.registerRpc('join_room_as_offline', rpcJoinRoomStreamAsOffline);
    initializer.registerRpc('count_room_online_users', rpcCountRoomOnlineUsers);
    initializer.registerRpc('get_online_users_in_room', rpcGetOnlineUsersInRoom);
    initializer.registerRpc('update_user_profile', updateUserProfile);
    initializer.registerRpc('get_friends_from_userid', rpcGetFriendsFromUserID);
    initializer.registerRpc('get_non_friends_ids_from_userid', rpcGetNonFriendsUserIdsFromUserID);  
    logger.info('JavaScript logic loaded.');
}