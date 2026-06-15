import { useState } from 'react';
import FeedbackButtons from './FeedbackButtons';

export default function ExplanationPanel({
  explanation,
  loading,
  onFeedback,
  currentLevel,
  explanationId,
}) {
  const [copied, setCopied] = useState(false);

  const levelConfig = {
    beginner: { badge: 'badge-emerald', label: '👶 Beginner' },
    intermediate: { badge: 'badge-amber', label: '👨‍💻 Intermediate' },
    expert: { badge: 'badge-rose', label: '🧠 Expert' },
  };

  const config = levelConfig[currentLevel] || levelConfig.beginner;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = explanation;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!explanation && !loading) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <div className="text-6xl mb-4">🧩</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          Ready to Explain
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Paste your code on the left and click "Explain This Code" to get an
          AI-powered explanation at your chosen complexity level.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {loading && (
        <div className="glass-card p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">AI is thinking...</span>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/[0.04] rounded-lg w-3/4 shimmer" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-full shimmer" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-5/6 shimmer" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-2/3 shimmer" />
            <div className="h-4 bg-white/[0.04] rounded-lg w-4/5 shimmer" />
          </div>
        </div>
      )}

      {/* Explanation Content */}
      {explanation && !loading && (
        <div className="glass-card p-8 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className={config.badge}>
              {config.label}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-white/[0.06] transition-all duration-200"
              title="Copy explanation"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-accent-emerald">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Explanation Text */}
          <div className="mb-6">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">
              {explanation}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Feedback */}
          <FeedbackButtons
            explanationId={explanationId}
            onFeedback={onFeedback}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
