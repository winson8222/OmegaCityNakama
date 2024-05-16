// Method use in main
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InitModule(
  _ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  _nk: nkruntime.Nakama,
  initializer: nkruntime.Initializer,
) {
  initializer.registerRpc("users", rpcUsers);
  initializer.registerRpc("healthcheck", rpcHealthCheck);
  initializer.registerRpc("echo", rpcEcho);
  initializer.registerRpc("list_channel_members", listChannelMembers);
  initializer.registerRpc("update_user_profile", updateUserProfile);

  logger.info("JavaScript logic loaded.");
}
