// Method use in main

function _InitModule(
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _ctx: nkruntime.Context,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  logger: nkruntime.Logger,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _nk: nkruntime.Nakama,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  initializer: nkruntime.Initializer,
) {
  initializer.registerRpc("users", _rpcUsers);
  initializer.registerRpc("healthcheck", _rpcHealthCheck);
  initializer.registerRpc("echo", _rpcEcho);
  initializer.registerRpc("list_channel_members", _listChannelMembers);
  initializer.registerRpc("update_meta_data", _updateMetaData);
  initializer.registerRpc('send_notification', rpcSendNotification);
  initializer.registerRpc('join_online_users_stream', rpcJoinOnlineUsersStream);
  initializer.registerRpc('count_online_users', rpcCountOnlineUsers);
  initializer.registerRpc('get_online_users', rpcGetOnlineUsers);
  initializer.registerRpc('join_room_as_online', rpcJoinRoomStreamAsOnline);
  initializer.registerRpc('join_room_as_offline', rpcJoinRoomStreamAsOffline);
  initializer.registerRpc('count_room_online_users', rpcCountRoomOnlineUsers);
  initializer.registerRpc('get_online_users_in_room', rpcGetOnlineUsersInRoom);

  logger.info("JavaScript logic loaded.");
}
