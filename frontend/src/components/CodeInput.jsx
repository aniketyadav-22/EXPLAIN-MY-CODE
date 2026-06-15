import { useState } from 'react';

export default function CodeInput({ onExplain, loading }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onExplain(code, language);
    }
  };

  const languages = [
    { value: 'python', label: 'Python', color: 'text-yellow-400' },
    { value: 'javascript', label: 'JavaScript', color: 'text-yellow-300' },
    { value: 'java', label: 'Java', color: 'text-orange-400' },
    { value: 'cpp', label: 'C++', color: 'text-blue-400' },
    { value: 'go', label: 'Go', color: 'text-cyan-400' },
    { value: 'rust', label: 'Rust', color: 'text-orange-500' },
    { value: 'typescript', label: 'TypeScript', color: 'text-blue-500' },
    { value: 'csharp', label: 'C#', color: 'text-purple-400' },
    { value: 'php', label: 'PHP', color: 'text-indigo-400' },
    { value: 'sql', label: 'SQL', color: 'text-emerald-400' },
    { value: 'html', label: 'HTML', color: 'text-orange-400' },
    { value: 'css', label: 'CSS', color: 'text-blue-400' },
  ];

  const lineCount = code.split('\n').length;

  return (
    <div className="glass-card p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select-dark"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Code Input Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">
              Your Code
            </label>
            <span className="text-xs text-gray-600">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {code.length} chars
            </span>
          </div>
          <div className="relative group">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              rows={12}
              spellCheck={false}
              className="textarea-code"
            />
            {/* Focus glow ring */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.08), inset 0 0 30px rgba(6, 182, 212, 0.02)' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Explain This Code</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
