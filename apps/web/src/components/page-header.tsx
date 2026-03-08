import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  tags?: string[];
  actions?: ReactNode;
  metaLabel?: string;
  statusLabel?: string;
};

export function PageHeader({
  title,
  description,
  tags = [],
  actions,
  metaLabel = "EduNexus · Web 学习生态",
  statusLabel = "系统在线"
}: PageHeaderProps) {
  return (
    <header className="page-head page-head-unified">
      <div className="page-head-main">
        <div className="page-head-meta">
          <span className="page-head-meta-dot" />
          <em>{metaLabel}</em>
          <b>{statusLabel}</b>
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        {tags.length > 0 ? (
          <div className="page-head-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
      {actions ? <div className="page-head-actions">{actions}</div> : null}
    </header>
  );
}
