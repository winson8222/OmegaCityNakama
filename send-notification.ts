/** A notification to be sent. */
interface Notification {
    /** The user ID of the recipient. */
    userId: string;
    /** The subject of the notification. */
    subject: string;
    /** The content of the notification. */
    content: { [key: string]: any };
    /** The code of the notification. */
    code: number;
    /** The sender ID of the notification. */
    senderId?: string | null;
    /** Whether the notification should be persisted. */
    persistent?: boolean;
}

function isNotification(obj: any): obj is Notification {
    return 'userId' in obj && 'subject' in obj && 'content' in obj && 'code' in obj;
}

function rpcSendNotification(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if (!isNotification(json)) {
        return JSON.stringify({ error: "Invalid notification format" })
    }

    const notification = (json as Notification);
    nk.notificationSend(notification.userId, notification.subject, notification.content, notification.code, 
        notification.senderId, notification.persistent);
    return JSON.stringify(notification);
}