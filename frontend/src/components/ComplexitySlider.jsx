export default function ComplexitySlider({ level, onChange, disabled }) {
  const levels = [
    {
      value: 'beginner',
      label: 'Beginner',
      emoji: '👶',
      description: "Like I'm 5",
      color: 'from-emerald-500 to-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: '0 0 20px rgba(16, 185, 129, 0.15)',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      emoji: '👨‍💻',
      description: 'Junior Dev',
      color: 'from-amber-500 to-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: '0 0 20px rgba(245, 158, 11, 0.15)',
    },
    {
      value: 'expert',
      label: 'Expert',
      emoji: '🧠',
      description: 'Code Review',
      color: 'from-rose-500 to-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      glow: '0 0 20px rgba(244, 63, 94, 0.15)',
    },
  ];

  return (
    <div className="glass-card p-6">
      <label className="block text-sm font-medium text-gray-400 mb-4">
        Complexity Level
      </label>

      <div className="space-y-3">
        {levels.map((lv) => {
          const isActive = level === lv.value;
          return (
            <button
              key={lv.value}
              type="button"
              onClick={() => !disabled && onChange(lv.value)}
              disabled={disabled}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left
                ${isActive
                  ? `${lv.bg} ${lv.border}`
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={isActive ? { boxShadow: lv.glow } : {}}
            >
              {/* Emoji */}
              <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {lv.emoji}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span className={`block font-semibold text-sm ${isActive ? lv.text : 'text-gray-300'}`}>
                  {lv.label}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {lv.description}
                </span>
              </div>

              {/* Active Indicator */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isActive ? `${lv.border} ${lv.bg}` : 'border-white/10'}
              `}>
                {isActive && (
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${lv.color}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
