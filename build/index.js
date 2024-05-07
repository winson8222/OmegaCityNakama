"use strict";
function rpcEcho(ctx, logger, nk, payload) {
    return JSON.stringify({ echo: payload });
}
function rpcHealthCheck(ctx, logger, nk, payload) {
    return JSON.stringify({ status: 'ok' });
}
function InitModule(ctx, logger, nk, initializer) {
    initializer.registerRpc('echo', rpdcEcho);
    logger.info('JavaScript logic loaded.');
}
