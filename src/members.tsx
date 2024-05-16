// Method use in main
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listChannelMembers: nkruntime.RpcFunction = function (
  _context: nkruntime.Context,
  _logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  _payload: string,
): string {
  // Implementation depends on your database schema and how you track channel memberships
  // Typically, you would query a database or use Nakama's storage engine to fetch member info
  const users = nk.sqlQuery(
    `SELECT username FROM public.users ORDER BY id ASC`,
  );
  const jsonString = JSON.stringify(users);

  return jsonString;
};
