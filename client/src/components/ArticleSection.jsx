function ArticleSection({ title, content }) {
    return (
        <div className="articleSection">
            {title && <h2>{title}</h2>}
            {content && (
                <div>
                    {content.split("\n").map((paragraph, index) => (
                        paragraph.trim().startsWith("•") ? (
                            <li key={index} style={{ marginLeft: "20px", color: "inherit", marginBottom: "8px" }}>
                                {paragraph.replace("•", "").trim()}
                            </li>
                        ) : (
                            <p key={index}>{paragraph}</p>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArticleSection;