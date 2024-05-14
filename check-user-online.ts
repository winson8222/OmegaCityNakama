interface UserIDAndSession {
    userId: string;
    sessionId: string;
}

function isUserIDAndSession(obj: any): obj is UserIDAndSession {
    return 'userId' in obj && 'sessionId' in obj;
}
function rpcCheckUserOnline(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const jsonPayload = JSON.parse(payload);
    if (!isUserIDAndSession(jsonPayload)) {
        return JSON.stringify({ error: "Invalid payload" });
    }
    const { userId, sessionId } = jsonPayload;
    const onlineUsersStreamId: nkruntime.Stream = {
        mode: 1000,
        label: "Online Users",
    }
    const meta = nk.streamUserGet(userId, sessionId, onlineUsersStreamId);
    return meta ? "Online" : "Offline";
}