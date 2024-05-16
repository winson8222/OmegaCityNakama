// Method use in main
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rpcEcho(
  _ctx: nkruntime.Context,
  _logger: nkruntime.Logger,
  _nk: nkruntime.Nakama,
  payload: string,
): string {
  return JSON.stringify({ echo: payload });
}
