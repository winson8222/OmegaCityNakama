// In your Nakama server module (TypeScript)
let listChannelMembers: nkruntime.RpcFunction = function(context: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    // Implementation depends on your database schema and how you track channel memberships
    // Typically, you would query a database or use Nakama's storage engine to fetch member info
    const users = nk.sqlQuery(`SELECT username FROM public.users ORDER BY id ASC`);
    const jsonString = JSON.stringify(users);
    
    return jsonString;
};