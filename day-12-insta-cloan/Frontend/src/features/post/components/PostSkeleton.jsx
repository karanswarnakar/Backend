const PostSkeleton = () => (
    <article className="post-skeleton" aria-hidden="true">
        <div className="post-skeleton__header">
            <span className="post-skeleton__avatar" />
            <div><i /><i /></div>
        </div>
        <span className="post-skeleton__image" />
        <div className="post-skeleton__actions"><i /><i /><i /></div>
        <i className="post-skeleton__line" />
    </article>
);

export default PostSkeleton;
