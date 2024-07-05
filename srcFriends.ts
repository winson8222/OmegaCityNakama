interface SelectUserQueryStatement {
  limitQuery: string,
  cursorQuery: string,
  searchTermQuery: string,
  filterQuery: string
}


/**
 * Contains parameters to fetch user ids list from a user ID.
 */
interface UserIDsListInfo {
    /** The ID of the user fetching other user ids */
    userId: string
    /**The number of user ids to retrieve in this page of results. No more than 100 limit allowed per result.
     * Default limit is 100.
     */
    limit?: number,
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
 * Contains parameters to fetch friends list from a user ID.
 * https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/#friendsList
 */
interface FriendsListInfo extends UserIDsListInfo {
    /**
     * The state of the friendship with the user. If unspecified this returns friends in all states for the user.
     */
    state?: number,
}

// /**
//  * Contains parameters to fetch non friends user ids list from a user ID.
//  */
// interface GetNonFriendsUserIDsInfo {
//   /** The ID of the user whose friends, invites, invited, and blocked you want to list. */
//   userId: string
//   /**The number of friends to retrieve in this page of results. No more than 100 limit allowed per result.
//    * Default limit is 100.
//    */
//   limit?: number,
//   /**
//    * Page number to fetch. First page is 1.
//    */
//   page?: number
// }

// /**
//  * Contains parameters to fetch friends user ids list from a user ID.
//  */
// interface GetFriendsUserIDsInfo {
//   /** The ID of the user whose friends, invites, invited, and blocked you want to list. */
//   userId: string
//   /**
//   * The state of the friendship with the user. If unspecified this returns friends in all states for the user.
//   */
//   state?: number,
//   /**The number of friends to retrieve in this page of results. No more than 100 limit allowed per result.
//    * Default limit is 100.
//    */
//   limit?: number,
//   /**
//    * Page number to fetch. First page is 1.
//    */
//   page?: number
// }

function isUserIDsListInfo(obj: any): obj is UserIDsListInfo {
    return 'userId' in obj;
}

function isFriendsListInfo(obj: any): obj is FriendsListInfo {
    return 'userId' in obj;
}

// function isGetNonFriendsUserIDsInfo(obj: any): obj is GetNonFriendsUserIDsInfo {
//   return 'userId' in obj;
// }

// function isGetFriendsUserIDsInfo(obj: any): obj is GetFriendsUserIDsInfo {
//   return 'userId' in obj;
// }

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
      if  (!isUserIDsListInfo(json)) {
          return JSON.stringify({ error: "Invalid get friends list info format" });
      }
      const userIDObj = (json as UserIDsListInfo);
      logger.info(`nonfriends query: ${getSelectQueryUserString(false, false, userIDObj)}`)
      const nonFriendsUsersQueryResult = nk.sqlQuery(getSelectQueryUserString(false, false, userIDObj));
      
      let lastID = undefined;
      if (nonFriendsUsersQueryResult.length > 0) {
        lastID = nonFriendsUsersQueryResult[nonFriendsUsersQueryResult.length - 1].id;
      } 

      // Map result to user ids
      const nonFriendsUserIDs = nonFriendsUsersQueryResult.map(obj => obj.id);
      return JSON.stringify({ nonFriendsUserIDs: nonFriendsUserIDs, cursor: lastID });
}

/**
 * Get friends list user ID from a user ID.
 */
function rpcGetFriendsUserIdsFromUserID(ctx: nkruntime.Context, 
  logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isFriendsListInfo(json)) {
        return JSON.stringify({ error: "Invalid get friends list info format" });
    }
    const userIDObj = (json as FriendsListInfo);
    const friendsUsersQueryResult = nk.sqlQuery(getSelectQueryUserString(false, true, userIDObj));
    
    let lastID = undefined;
    if (friendsUsersQueryResult.length > 0) {
      lastID = friendsUsersQueryResult[friendsUsersQueryResult.length - 1].id;
    } 

    // Map result to user ids
    const friendsUserIDs = friendsUsersQueryResult.map(obj => obj.id);
    return JSON.stringify({ friendsUserIDs: friendsUserIDs, cursor: lastID });
}

function rpcCountNonFriendsUserIdsFromUserID(ctx: nkruntime.Context, 
  logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isUserIDsListInfo(json)) {
        return JSON.stringify({ error: "Invalid get friends list info format" });
    }
    const userIDObj = (json as UserIDsListInfo); 
    const nonFriendsUsersQueryResult = nk.sqlQuery(getSelectQueryUserString(true, false, userIDObj));
    
    let count = 0;
    if (nonFriendsUsersQueryResult.length > 0) {
      count = nonFriendsUsersQueryResult[0].count;
    }
    return JSON.stringify({ count: count });
}

function rpcCountFriendsUserIdsFromUserID(ctx: nkruntime.Context, 
  logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if  (!isFriendsListInfo(json)) {
        return JSON.stringify({ error: "Invalid get friends list info format" });
    }
    const userIDObj = (json as FriendsListInfo);
    const friendsUsersQueryResult = nk.sqlQuery(getSelectQueryUserString(true, true, userIDObj));
    
    let count = 0;
    if (friendsUsersQueryResult.length > 0) {
      count = friendsUsersQueryResult[0].count;
    }
    return JSON.stringify({ count: count });
}

function getNonFriendsQueryStrings(userIDListInfoObj: UserIDsListInfo): SelectUserQueryStatement {
  let cursorQuery = '';
  let limitQuery = 'LIMIT 100';
  let searchTermQuery = '';
  if (userIDListInfoObj.limit) {
    limitQuery = `LIMIT ${userIDListInfoObj.limit}`;
  }
  if (userIDListInfoObj.cursor) {
    cursorQuery = `AND u.id > '${userIDListInfoObj.cursor}'`;
  }
  if (userIDListInfoObj.searchTerm) {
    searchTermQuery = `AND u.username LIKE '%${userIDListInfoObj.searchTerm}%'`;
  }
  const filterQuery = `AND u.id NOT IN (
      (SELECT destination_id
      FROM public.user_edge
      WHERE source_id = '${userIDListInfoObj.userId}')
      UNION
      (SELECT source_id
      FROM public.user_edge
      WHERE destination_id = '${userIDListInfoObj.userId}')
  )`;

  return { limitQuery, cursorQuery, searchTermQuery, filterQuery };
}

function getFriendsQueryStrings(friendsListInfoObj: FriendsListInfo): SelectUserQueryStatement {
  const limitCursorSearchTermQuery = getNonFriendsQueryStrings(friendsListInfoObj);
  const limitQuery = limitCursorSearchTermQuery.limitQuery;
  const cursorQuery = limitCursorSearchTermQuery.cursorQuery;
  const searchTermQuery = limitCursorSearchTermQuery.searchTermQuery;
  let friendStateQuery = '';

  if (friendsListInfoObj.state !== undefined) {
    friendStateQuery = `AND state = ${friendsListInfoObj.state}`;
  }
  const filterQuery = `AND u.id IN (
      SELECT destination_id
      FROM public.user_edge
      WHERE source_id = '${friendsListInfoObj.userId}'
          ${friendStateQuery}
  )`;
  return {
    limitQuery,
    cursorQuery,
    searchTermQuery,
    filterQuery
  };
}


function getSelectQueryUserString(isCounting: boolean, isFriends: boolean, userIDListInfoObj: UserIDsListInfo): string {
  let selectQuery = '';
  let sortQuery = '';
  if (isCounting) {
    selectQuery = 'SELECT COUNT(id)';
  } else {
    selectQuery = 'SELECT id';
    sortQuery = 'ORDER BY u.id ASC';
  }
  
  let fromQuery = 'FROM public.users u';
  let whereQuery = `WHERE u.id != '00000000-0000-0000-0000-000000000000' AND u.id != '${userIDListInfoObj.userId}'`;
  let limitQuery = '';
  let cursorQuery = '';
  let searchTermQuery = '';
  let filterQuery = '';

  if (isFriends) {
    const friendsListInfoObj = userIDListInfoObj as FriendsListInfo;
    const friendsQueryStrings = getFriendsQueryStrings(friendsListInfoObj);
    limitQuery = friendsQueryStrings.limitQuery;
    cursorQuery = !isCounting ? friendsQueryStrings.cursorQuery : '';
    searchTermQuery = friendsQueryStrings.searchTermQuery;
    filterQuery = friendsQueryStrings.filterQuery;
  } else {
    const nonFriendsQueryStrings = getNonFriendsQueryStrings(userIDListInfoObj);
    limitQuery = nonFriendsQueryStrings.limitQuery;
    cursorQuery = !isCounting ? nonFriendsQueryStrings.cursorQuery : '';
    searchTermQuery = nonFriendsQueryStrings.searchTermQuery;
    filterQuery = nonFriendsQueryStrings.filterQuery
  }

  return `${selectQuery} ${fromQuery} ${whereQuery} ${cursorQuery} ${searchTermQuery} ${filterQuery} ${sortQuery} ${limitQuery};`;
}