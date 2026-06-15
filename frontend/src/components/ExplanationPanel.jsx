import FeedbackButtons from './FeedbackButtons';

export default function ExplanationPanel({
  explanation,
  loading,
  onFeedback,
  onLevelChange,
  currentLevel,
  explanationId,
}) {
  if (!explanation && !loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Paste code and select a complexity level to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )}

      {explanation && !loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level
            </span>
          </div>

          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          </div>

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
