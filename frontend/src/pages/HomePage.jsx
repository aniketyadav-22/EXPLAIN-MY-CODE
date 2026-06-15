import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeInput from '../components/CodeInput';
import ComplexitySlider from '../components/ComplexitySlider';
import ExplanationPanel from '../components/ExplanationPanel';
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
  const navigate = useNavigate();

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
      
      // Cache the explanation
      setExplanationCache((prev) => ({
        ...prev,
        [cacheKey(response.data.snippet_id, level)]: exp,
      }));
    } catch (err) {
      setError('Failed to get explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
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
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (expId, isHelpful, comment) => {
    try {
      await explainApi.sendFeedback(expId, isHelpful, comment);
      alert(isHelpful ? 'Thanks for the feedback!' : 'Thanks for helping us improve!');
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explain My Code Like I'm 5
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Get AI-powered code explanations at your preferred complexity level
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/history')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📚 History
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📊 Analytics
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="space-y-6">
            <CodeInput onExplain={handleExplain} loading={loading} />
            <ComplexitySlider
              level={level}
              onChange={handleLevelChange}
              disabled={loading || !code}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
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
    </div>
  );
}
