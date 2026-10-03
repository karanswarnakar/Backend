const PostSkeleton = ({ index = 0 }) => (
    <article
        className="post-skeleton"
        aria-hidden="true"
        style={{ "--skeleton-delay": `${index * 110}ms` }}
    >
        <div className="post-skeleton__header">
            <span className="post-skeleton__avatar" />
            <div className="post-skeleton__identity">
                <i className="post-skeleton__name" />
                <i className="post-skeleton__handle" />
            </div>
            <span className="post-skeleton__menu" />
        </div>
        <span className="post-skeleton__image" />
        <div className="post-skeleton__actions"><i /><i /><i /></div>
        <div className="post-skeleton__caption">
            <i className="post-skeleton__line" />
            <i className="post-skeleton__line post-skeleton__line--short" />
        </div>
    </article>
);

export default PostSkeleton;
