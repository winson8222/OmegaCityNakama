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