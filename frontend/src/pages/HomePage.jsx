import { useState } from 'react';
import CodeInput from '../components/CodeInput';
import ComplexitySlider from '../components/ComplexitySlider';
import ExplanationPanel from '../components/ExplanationPanel';
import { useToast } from '../components/Toast';
import { explainApi } from '../api/client';

export default function HomePage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [level, setLevel] = useState('beginner');
  const [explanation, setExplanation] = useState('');
  const [snippetId, setSnippetId] = useState('');
  const [explanationId, setExplanationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [explanationCache, setExplanationCache] = useState({});
  const { showToast } = useToast();

  const cacheKey = (hash, lv) => `${hash}-${lv}`;

  const handleExplain = async (codeText, lang) => {
    setCode(codeText);
    setLanguage(lang);
    setError('');
    setLoading(true);

    try {
      const response = await explainApi.explainCode(codeText, lang, level);
      const { snippet_id, explanation: exp } = response.data;

      setSnippetId(snippet_id);
      setExplanationId(exp.id);
      setExplanation(exp.explanation_text);

      setExplanationCache((prev) => ({
        ...prev,
        [cacheKey(response.data.snippet_id, level)]: exp,
      }));

      if (response.data.cached) {
        showToast('Loaded from cache — instant result!', 'info');
      }
    } catch (err) {
      setError('Failed to get explanation. Please try again.');
      showToast('Failed to get explanation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
    if (!code) return;

    setError('');
    setLoading(true);

    const key = cacheKey(snippetId, newLevel);
    if (explanationCache[key]) {
      const cached = explanationCache[key];
      setExplanation(cached.explanation_text);
      setExplanationId(cached.id);
      setLoading(false);
      return;
    }

    try {
      const response = await explainApi.explainCode(code, language, newLevel);
      const { explanation: exp } = response.data;

      setExplanationId(exp.id);
      setExplanation(exp.explanation_text);

      setExplanationCache((prev) => ({
        ...prev,
        [key]: exp,
      }));
    } catch (err) {
      setError('Failed to get explanation. Please try again.');
      showToast('Failed to get explanation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (expId, isHelpful, comment) => {
    try {
      await explainApi.sendFeedback(expId, isHelpful, comment);
      showToast(
        isHelpful ? 'Thanks for the positive feedback!' : 'Thanks for helping us improve!',
        'success'
      );
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <header className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-5xl sm:text-6xl font-black mb-4">
          <span className="text-gradient">Explain My Code</span>
          <br />
          <span className="text-white">Like I'm 5</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Get AI-powered code explanations at your preferred complexity level —
          from beginner-friendly analogies to expert-level code reviews.
        </p>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CodeInput onExplain={handleExplain} loading={loading} />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <ComplexitySlider
              level={level}
              onChange={handleLevelChange}
              disabled={loading || !code}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <ExplanationPanel
            explanation={explanation}
            loading={loading}
            onFeedback={handleFeedback}
            currentLevel={level}
            explanationId={explanationId}
          />
        </div>
      </div>
    </div>
  );
}
