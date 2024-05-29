/**
 * Contains parameters to fetch friends list from a user ID.
 * https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/#friendsList
 */
interface FriendsListInfo {
    /** The ID of the user whose friends, invites, invited, and blocked you want to list. */
    userId: string
    /**The number of friends to retrieve in this page of results. No more than 100 limit allowed per result.
     * Default limit is 100.
     */
    limit?: number,
    /**
     * The state of the friendship with the user. If unspecified this returns friends in all states for the user.
     */
    state?: number,
    /**
     * Pagination cursor from previous result. Don't set to start fetching from the beginning.
     */
    cursor?: string
}

function isFriendsListInfo(obj: any): obj is FriendsListInfo {
    return 'userId' in obj;
}

/**
 * Gets friends list from payload containing friendsList parameters.
 * https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/#friendsList
 */
function rpcGetFriendsFromUserID(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isFriendsListInfo(json)) {
        return JSON.stringify({ error: "Invalid get friends list info format" });
    }
    const userIDObj = (json as FriendsListInfo);
    return JSON.stringify(nk.friendsList(userIDObj.userId, userIDObj.limit, userIDObj.state, userIDObj.cursor));
}