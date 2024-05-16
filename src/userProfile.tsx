// Method use in main
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUserProfile: nkruntime.RpcFunction = function (
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string,
): string {
  // Get the user ID from the context
  const userId = context.userId;
  if (!userId) {
    throw Error("Could not get user ID from context");
  }

  // Parse the payload if needed (currently hardcoded metadata is used)
  let userProfile;
  try {
    userProfile = JSON.parse(payload);
  } catch (error) {
    logger.error("Failed to parse payload", error);
    throw error;
  }

  // Update the user account
  try {
    nk.accountUpdateId(
      userId,
      null,
      userProfile.display_name,
      null,
      null,
      null,
      userProfile.avatar_url,
      userProfile.metadata,
    );
  } catch (error) {
    logger.error("Could not update account", error);
    return JSON.stringify({ response: "error" });
  }

  return JSON.stringify({ response: "ok" });
};
