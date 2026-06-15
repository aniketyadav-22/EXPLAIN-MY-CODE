import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No feedback data yet. Submit some explanations first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Explanation Helpfulness by Level</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="level"
            tickFormatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value) => `${value.toFixed(1)}%`}
            labelFormatter={(label) =>
              label.charAt(0).toUpperCase() + label.slice(1)
            }
          />
          <Bar dataKey="helpful_percentage" fill="#3b82f6" name="Helpful %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
