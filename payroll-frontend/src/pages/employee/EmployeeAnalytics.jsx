import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const analyticsData = {
  2026: {
    monthly: [
      { month: "Jan", days: 2 },
      { month: "Feb", days: 1 }
    ],
    distribution: [
      { name: "CL", value: 5 },
      { name: "SL", value: 3 }
    ]
  }
};

const COLORS = ["#2563EB", "#10B981"];

export default function EmployeeAnalytics() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const monthlyData = analyticsData[selectedYear]?.monthly || [];
  const distributionData =
    analyticsData[selectedYear]?.distribution || [];

  return (
    <div className="space-y-16">

      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-gray-500 text-lg">
          Analyze your leave patterns and insights.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm space-y-12">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium text-gray-900">
            Leave Analytics
          </h2>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
          >
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="bg-gray-50 rounded-2xl p-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="days"
                  stroke="#2563EB"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

    </div>
  );
}