export default function HistoryList({ snippets, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.04] rounded-lg w-3/4 shimmer" />
              <div className="h-4 bg-white/[0.04] rounded-lg w-full shimmer" />
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-16 bg-white/[0.04] rounded-full shimmer" />
                <div className="h-5 w-20 bg-white/[0.04] rounded-full shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!snippets || snippets.length === 0) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No history yet</h3>
        <p className="text-gray-500">
          Your explained code snippets will appear here.
        </p>
      </div>
    );
  }

  const langColors = {
    python: 'badge-amber',
    javascript: 'badge-amber',
    java: 'badge-rose',
    cpp: 'badge-cyan',
    go: 'badge-cyan',
    rust: 'badge-rose',
    typescript: 'badge-cyan',
    csharp: 'badge-violet',
    php: 'badge-violet',
    sql: 'badge-emerald',
    html: 'badge-rose',
    css: 'badge-cyan',
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {snippets.map((snippet, index) => (
        <div
          key={snippet.id}
          className="glass-card-hover p-5 cursor-default animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Code Preview */}
              <pre className="font-mono text-sm text-gray-400 line-clamp-2 mb-3 overflow-hidden">
                {snippet.code_text}
              </pre>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={langColors[snippet.language] || 'badge-cyan'}>
                  {snippet.language}
                </span>
                {snippet.explanations && snippet.explanations.length > 0 && (
                  <span className="badge-violet">
                    {snippet.explanations.length} {snippet.explanations.length === 1 ? 'explanation' : 'explanations'}
                  </span>
                )}
              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0 mt-1">
              {timeAgo(snippet.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
