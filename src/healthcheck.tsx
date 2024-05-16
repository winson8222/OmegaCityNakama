// Method use in main
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rpcHealthCheck(
  _ctx: nkruntime.Context,
  _logger: nkruntime.Logger,
  _nk: nkruntime.Nakama,
  _payload: string,
): string {
  return JSON.stringify({ status: "ok" });
}
