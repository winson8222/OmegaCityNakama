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
    /**
     * Search term to filter friends by. If set, only friends with usernames containing this term will be returned.
     */
    searchTerm?: string
}

/**
 * Contains parameters to fetch non friends user ids list from a user ID.
 */
interface GetNonFriendsUserIDsInfo {
  /** The ID of the user whose friends, invites, invited, and blocked you want to list. */
  userId: string
  /**The number of friends to retrieve in this page of results. No more than 100 limit allowed per result.
   * Default limit is 100.
   */
  limit?: number,
  /**
   * Page number to fetch. First page is 1.
   */
  page?: number
}

/**
 * Contains parameters to fetch friends user ids list from a user ID.
 */
interface GetFriendsUserIDsInfo {
  /** The ID of the user whose friends, invites, invited, and blocked you want to list. */
  userId: string
  /**
  * The state of the friendship with the user. If unspecified this returns friends in all states for the user.
  */
  state?: number,
  /**The number of friends to retrieve in this page of results. No more than 100 limit allowed per result.
   * Default limit is 100.
   */
  limit?: number,
  /**
   * Page number to fetch. First page is 1.
   */
  page?: number
}

function isFriendsListInfo(obj: any): obj is FriendsListInfo {
    return 'userId' in obj;
}

function isGetNonFriendsUserIDsInfo(obj: any): obj is GetNonFriendsUserIDsInfo {
  return 'userId' in obj;
}

function isGetFriendsUserIDsInfo(obj: any): obj is GetFriendsUserIDsInfo {
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

/**
 * Get non friends list user ID from a user ID.
 */
function rpcGetNonFriendsUserIdsFromUserID(ctx: nkruntime.Context, 
    logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
      const json = JSON.parse(payload);
      if  (!isGetNonFriendsUserIDsInfo(json)) {
          return JSON.stringify({ error: "Invalid get friends list info format" });
      }
      const userIDObj = (json as FriendsListInfo);
      let cursorQuery = '';
      let limitQuery = 'LIMIT 100';
      let searchTermQuery = '';
      if (userIDObj.limit) {
        limitQuery = `LIMIT ${userIDObj.limit}`;
      }
      if (userIDObj.cursor) {
        cursorQuery = `AND u.id > '${userIDObj.cursor}'`;
      }
      if (userIDObj.searchTerm) {
        searchTermQuery = `AND u.username LIKE '%${userIDObj.searchTerm}%'`;
      }

      const nonFriendsUsersQueryResult = nk.sqlQuery(`SELECT *
          FROM public.users u
          WHERE u.id != '00000000-0000-0000-0000-000000000000'
            AND u.id != '${userIDObj.userId}'
            ${cursorQuery}
            ${searchTermQuery}
            AND u.id NOT IN (
              SELECT destination_id
              FROM public.user_edge
              WHERE source_id = '${userIDObj.userId}'
              UNION
              SELECT source_id
              FROM public.user_edge
              WHERE destination_id = '${userIDObj.userId}'
          )
          ORDER BY u.id ASC
          ${limitQuery};`);
      
      let lastID = undefined;
      if (nonFriendsUsersQueryResult.length > 0) {
        lastID = nonFriendsUsersQueryResult[nonFriendsUsersQueryResult.length - 1].id;
      } 

      // Map result to user ids
      const nonFriendsUserIDs = nonFriendsUsersQueryResult.map(obj => obj.id);
      return JSON.stringify({ nonFriendsUserIDs: nonFriendsUserIDs, cursor: lastID });
}
