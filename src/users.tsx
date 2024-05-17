/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
function _rpcUsers(
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _ctx: nkruntime.Context,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _logger: nkruntime.Logger,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  nk: nkruntime.Nakama,
  _payload: string,
): string {
  const users =
    nk.sqlQuery(`SELECT id, facebook_id, google_id, steam_id, custom_id, username, 
    display_name, avatar_url, wallet, email, metadata FROM public.users ORDER BY id ASC`);

  // Define the order of properties
  const propertyOrder = [
    "id",
    "facebook_id",
    "google_id",
    "steam_id",
    "custom_id",
    "username",
    "display_name",
    "avatar_url",
    "wallet",
    "email",
    "metadata",
  ];

  // Function to reorder properties in an object

  function reorderProperties(obj: any) {
    const orderedObj: any = {};
    propertyOrder.forEach((prop) => {
      if (obj.hasOwnProperty(prop)) {
        orderedObj[prop] = obj[prop];
      }
    });
    return orderedObj;
  }

  // Convert SQL result to JSON with consistent property order
  const orderedUsers = users.map((obj: any) => reorderProperties(obj));

  // Convert to JSON string
  const jsonString = JSON.stringify(orderedUsers);

  return jsonString;
}
