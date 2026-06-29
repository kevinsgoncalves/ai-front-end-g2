import type { Source } from '../types';

interface SourcePanelProps {
  sources: Source[];
}

function SourcePanel({ sources }: SourcePanelProps) {
  if (sources.length === 0) return null;

  return (
    <details className="source-panel">
      <summary className="source-panel__summary">
        Fontes ({sources.length})
      </summary>
      <div className="source-panel__list">
        {sources.map((source) => (
          <div
            key={`${source.documentId}-${source.chunkId}`}
            className="source-panel__card"
            data-document-id={source.documentId}
            data-chunk-id={source.chunkId}
          >
            <div className="source-panel__header">
              <span
                className="source-panel__file-name"
                title={source.fileName}
              >
                {source.fileName}
              </span>
              <span className="source-panel__score">
                {Math.round(source.similarityScore * 100)}%
              </span>
            </div>
            <blockquote className="source-panel__content">
              {source.content}
            </blockquote>
            <div className="source-panel__meta">
              doc {source.documentId} &middot; chunk {source.chunkId}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export default SourcePanel;
