import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { explainApi } from '../api/client';
import { HelpfulnessChart, LanguageDistributionChart } from '../components/AnalyticsChart';
import AnimatedCounter from '../components/AnimatedCounter';

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await explainApi.getAnalytics();
      setData(response.data);
    } catch (err) {
      setError('Please log in to view analytics.');
      setTimeout(() => navigate('/login'), 1500);
    } finally {
      setLoading(false);
    }
  };

  // Compute summary stats
  const totalExplanations = data.reduce((sum, d) => sum + (d.total_explanations || 0), 0);
  const totalHelpful = data.reduce((sum, d) => sum + (d.helpful_count || 0), 0);
  const totalUnhelpful = data.reduce((sum, d) => sum + (d.unhelpful_count || 0), 0);
  const totalFeedback = totalHelpful + totalUnhelpful;
  const overallHelpful = totalFeedback > 0 ? ((totalHelpful / totalFeedback) * 100) : 0;

  const statCards = [
    {
      label: 'Total Explanations',
      value: totalExplanations,
      suffix: '',
      icon: '📝',
      color: 'after:bg-accent-cyan',
    },
    {
      label: 'Total Feedback',
      value: totalFeedback,
      suffix: '',
      icon: '💬',
      color: 'after:bg-accent-violet',
    },
    {
      label: 'Helpful Rate',
      value: overallHelpful,
      suffix: '%',
      icon: '👍',
      color: 'after:bg-accent-emerald',
    },
    {
      label: 'Levels Active',
      value: data.length,
      suffix: '/3',
      icon: '📊',
      color: 'after:bg-accent-amber',
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500">Insights into your code explanations</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {/* Stat Card Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-white/[0.04] rounded-lg w-2/3 shimmer" />
                  <div className="h-8 bg-white/[0.04] rounded-lg w-1/2 shimmer" />
                </div>
              </div>
            ))}
          </div>
          {/* Chart Skeleton */}
          <div className="glass-card p-6">
            <div className="h-[280px] bg-white/[0.02] rounded-xl shimmer" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card ${stat.color} animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <HelpfulnessChart data={data} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <LanguageDistributionChart
                data={data.map((d) => ({
                  name: typeof d.level === 'string' ? d.level.charAt(0).toUpperCase() + d.level.slice(1) : d.level,
                  count: d.total_explanations,
                }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
