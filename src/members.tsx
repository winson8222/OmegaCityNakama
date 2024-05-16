// @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
const _listChannelMembers: nkruntime.RpcFunction = function (
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _context: nkruntime.Context,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _logger: nkruntime.Logger,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
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
