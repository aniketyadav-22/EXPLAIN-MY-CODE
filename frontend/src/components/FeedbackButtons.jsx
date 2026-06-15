import { useState } from 'react';

export default function FeedbackButtons({ explanationId, onFeedback, disabled }) {
  const [commented, setCommented] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (isHelpful) => {
    onFeedback(explanationId, isHelpful, comment);
    setCommented(false);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-accent-emerald/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-accent-emerald">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-400">Was this helpful?</p>

      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback(true)}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 text-accent-emerald hover:bg-accent-emerald/10 hover:border-accent-emerald/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">👍</span>
          <span>Yes, helpful</span>
        </button>

        <button
          onClick={() => setCommented(!commented)}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-accent-rose/20 bg-accent-rose/5 text-accent-rose hover:bg-accent-rose/10 hover:border-accent-rose/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">👎</span>
          <span>Not helpful</span>
        </button>
      </div>

      {commented && (
        <div className="space-y-3 animate-slide-in-down">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what was wrong or confusing..."
            rows={3}
            className="input-dark text-sm"
          />
          <button
            onClick={() => handleFeedback(false)}
            disabled={disabled}
            className="w-full py-3 px-4 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose hover:bg-accent-rose/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
