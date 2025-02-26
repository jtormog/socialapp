'use client'

import Comment from './comment'

export default function CommentList({ comments = [], onReply, onLoadMore }) {
    const hasMoreComments = comments.length > 0 && comments[0].total > comments.length;

    return (
        <div className="mt-4">
            <div className="mt-4">
                {comments.map((comment) => (
                    <Comment 
                        key={comment.comment_id} 
                        comment={comment} 
                        onReply={onReply}
                    />
                ))}
                {hasMoreComments && (
                    <button
                        onClick={onLoadMore}
                        className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Load More Comments
                    </button>
                )}
            </div>
        </div>
    )
}