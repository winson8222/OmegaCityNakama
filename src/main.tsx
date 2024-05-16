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

  logger.info("JavaScript logic loaded.");
}
