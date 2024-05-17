function _rpcHealthCheck(
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _ctx: nkruntime.Context,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _logger: nkruntime.Logger,
  // @ts-expect-error: TS2503: Cannot find namespace 'nkruntime'
  _nk: nkruntime.Nakama,
  _payload: string,
): string {
  return JSON.stringify({ status: "ok" });
}
