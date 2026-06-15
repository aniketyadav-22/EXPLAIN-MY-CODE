import { useState } from 'react';

export default function FeedbackButtons({ explanationId, onFeedback, disabled }) {
  const [commented, setCommented] = useState(false);
  const [comment, setComment] = useState('');

  const handleFeedback = (isHelpful) => {
    onFeedback(explanationId, isHelpful, comment);
    setCommented(false);
    setComment('');
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-3">Was this helpful?</p>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback(true)}
          disabled={disabled}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          👍 Yes
        </button>
        
        <button
          onClick={() => setCommented(!commented)}
          disabled={disabled}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          👎 No
        </button>
      </div>

      {commented && (
        <div className="mt-3 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what was wrong or confusing..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={() => handleFeedback(false)}
            disabled={disabled}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
