interface Room {
  roomName: string;
}

function isRoom(obj: any): obj is Room {
  return (
    obj != null &&
    typeof obj === "object" &&
    "roomName" in obj &&
    typeof obj.roomName === "string"
  );
}

/**
 * Get the stream ID of a room.
 */
function getRoomStreamId(room: Room): nkruntime.Stream {
  return {
    mode: 205,
    label: room.roomName,
  };
}

/**
 * Join the room stream as online user.
 * This means the user is visible to other users in the room.
 */
function rpcJoinRoomStreamAsOnline(
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  const json = JSON.parse(payload);
  if (!isRoom(json)) {
    return JSON.stringify({ error: "Invalid room format" });
  }
  const room = json as Room;
  const roomStreamId = getRoomStreamId(room);

  const hidden: boolean = false;
  const persistence: boolean = true;

  // Kicks the offline user that is hidden out of the room stream,
  // and joins the same room stream as an online user that is visible to the room stream.
  // The online user will show up as presence events in the room stream.
  // I tried to research how to change the visibility of the user that is already in the room stream,
  // but I couldn't find any information on that. So I decided to use this method to change the visibility of the user.
  nk.streamUserLeave(ctx.userId, ctx.sessionId, roomStreamId);
  nk.streamUserJoin(
    ctx.userId,
    ctx.sessionId,
    roomStreamId,
    hidden,
    persistence
  );
  return JSON.stringify({ status: "success" });
}

/**
 * Join the room stream as offline user.
 * This means the user is not visible to other users in the room.
 */
function rpcJoinRoomStreamAsOffline(
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  const json = JSON.parse(payload);
  if (!isRoom(json)) {
    return JSON.stringify({ error: "Invalid room format" });
  }
  const room = json as Room;
  const roomStreamId = getRoomStreamId(room);

  const hidden: boolean = true;
  const persistence: boolean = true;

  nk.streamUserJoin(
    ctx.userId,
    ctx.sessionId,
    roomStreamId,
    hidden,
    persistence
  );
  return JSON.stringify({ status: "success" });
}

/**
 * Get all online users in a room by getting all users in the room stream that are not hidden.
 */
function rpcGetOnlineUsersInRoom(
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  const json = JSON.parse(payload);
  if (!isRoom(json)) {
    return JSON.stringify({ error: "Invalid room format" });
  }
  const room = json as Room;
  const roomStreamId = getRoomStreamId(room);
  // Acts as hashmap that checks if a user is online
  const roomOnlineUserIds: { [key: string]: { id: string; username: string } } =
    {};
  // Presence means the user is online
  const presences = nk.streamUserList(roomStreamId, false);
  logger.info(`presences: ${JSON.stringify(presences)}`);
  presences?.forEach((presence) => {
    roomOnlineUserIds[presence.userId] = {
      id: presence.userId,
      username: presence.username,
    };
  });

  return JSON.stringify(roomOnlineUserIds);
}

function rpcCountRoomOnlineUsers(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    payload: string
  ): string {
    let json;
    try {
      json = JSON.parse(payload);
    } catch (e) {
      return JSON.stringify({ status: "error", message: "Invalid JSON format" });
    }
  
    if (!isRoom(json)) {
      return JSON.stringify({ status: "error", message: "Invalid room format" });
    }
  
    const room = json as Room;
    const roomStreamId = getRoomStreamId(room);
    const presences = nk.streamUserList(roomStreamId, false);
    logger.info("count room online users", presences.length.toString());
    return JSON.stringify({ status: "success", count: presences.length.toString() });
  }
