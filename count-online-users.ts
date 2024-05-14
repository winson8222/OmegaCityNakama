function rpcCountOnlineUsers(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const onlineUsersStreamId: nkruntime.Stream = {
        mode: 1000,
        label: "Online Users",
    }
    const presences = nk.streamUserList(onlineUsersStreamId);
    return presences.length.toString();
}