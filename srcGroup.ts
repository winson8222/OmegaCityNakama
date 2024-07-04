interface GroupPost {
    /** The ID of the post. */
    postId: string;
    /** The ID of the group. */
    groupId: string;
    /** The ID of the user posting in the group. */
    userId: string;
    /** The content of the post. */
    content: Content;
    /** The timestamp of the post */
    timestamp: number;
}

interface Content {
    /** The text content of the post. */
    text?: string;
    /** The image URL of the post. */
    image?: string;
    /** The video URL of the post. */
    video?: string;
}

interface GroupPostComment {
    /** The ID of the comment. */
    commentId: string;
    /** The ID of the group. */
    groupId: string;
    /** The ID of the user commenting in the group. */
    userId: string;
    /** The ID of the post being commented on. */
    postId: string;
    /** The ID of the parent comment. If the parent comment ID is defined, the comment is a reply to that comment. */
    parentCommentId?: string;
    /** The content of the comment. */
    content: Content;
    /** The timestamp of the comment */
    timestamp: number;
}

function isGroupPost(obj: any): obj is GroupPost {
    return 'postId' in obj && 'groupId' in obj && 'userId' in obj && 'content' in obj && 'timestamp' in obj;
}

function isContent(obj: any): obj is Content {
    return 'text' in obj || 'image' in obj || 'video' in obj;
}

function isGroupPostComment(obj: any): obj is GroupPostComment {
    return 'commentId' in obj && 'groupId' in obj && 'userId' in obj && 'postId' in obj && 'content' in obj && 'timestamp' in obj;
}

/**
 * Get group posts from payload containing group post parameters.
 */
function rpcGetGroupPosts(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if (!isGroupPost(json)) {
        return JSON.stringify({ error: "Invalid group post format" });
    }
    const groupPostObj = (json as GroupPost);
    const groupPosts = nk.storageIndexList(getGroupPostIndex(groupPostObj.groupId), "", 100, ["-timestamp"]);
    return JSON.stringify(groupPosts);
}

/**
 * Get group post comments from payload containing group post comment parameters.
 */
function rpcGetGroupPostComments(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if (!isGroupPostComment(json)) {
        return JSON.stringify({ error: "Invalid group post comment format" });
    }
    const groupPostCommentObj = (json as GroupPostComment);
    const groupPostComments = nk.storageIndexList(getGroupPostCommentIndex(groupPostCommentObj.postId), "", 100, ["-timestamp"]);
    return JSON.stringify(groupPostComments);
}

/**
 * Get group post comment replies from payload containing group post comment reply parameters.
 */
function rpcGetGroupPostCommentReplies(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const json = JSON.parse(payload);
    if (!isGroupPostComment(json)) {
        return JSON.stringify({ error: "Invalid group post comment format" });
    }
    const groupPostCommentObj = (json as GroupPostComment);
    const groupPostCommentReplies = nk.storageIndexList(getGroupPostCommentRepliesIndex(groupPostCommentObj.commentId), "", 100, ["-timestamp"]);
    return JSON.stringify(groupPostCommentReplies);
}

function getGroupPostIndex(groupId: string): string {
    return `group_post:${groupId}`;
}

function getGroupPostCommentIndex(postId: string): string {
    return `group_post_comment:${postId}`;
}

function getGroupPostCommentRepliesIndex(commentId: string): string {
    return `group_post_comment_replies:${commentId}`;
}