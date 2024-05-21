/** A notification to be sent. */
interface Notification {
    /** The user ID of the recipient. */
    recipientUserId: string;
    /** The subject of the notification. */
    subject: string;
    /** The content of the notification. */
    content: { [key: string]: any };
    /** The code of the notification. */
    code: number;
    /** The sender user ID of the notification. */
    senderUserId?: string | null;
    /** Whether the notification should be persisted. */
    persistent?: boolean;
}

function isNotification(obj: any): obj is Notification {
    return 'recipientUserId' in obj && 'subject' in obj && 'content' in obj && 'code' in obj;
}

/**
 * Custom rpc to send a notification to a user. 
 * The notification should have a userId which is the id of the recipient, 
 * and a senderId which is the id of the sender.
 */
function rpcSendNotification(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if (!isNotification(json)) {
        return JSON.stringify({ error: "Invalid notification format" })
    }

    const notification = (json as Notification);
    nk.notificationSend(notification.recipientUserId, notification.subject, notification.content, notification.code, 
        notification.senderUserId, notification.persistent);
    return JSON.stringify(notification);
}