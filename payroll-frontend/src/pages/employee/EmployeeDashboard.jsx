import { useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";

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

/* -------------------- STATIC ANALYTICS DATA -------------------- */

const analyticsData = {
  2026: {
    monthly: [
      { month: "Jan", days: 2 },
      { month: "Feb", days: 1 },
      { month: "Mar", days: 3 },
      { month: "Apr", days: 0 },
      { month: "May", days: 2 },
      { month: "Jun", days: 1 }
    ],
    distribution: [
      { name: "CL", value: 5 },
      { name: "SL", value: 3 },
      { name: "LOP", value: 1 }
    ]
  },
  2025: {
    monthly: [
      { month: "Jan", days: 1 },
      { month: "Feb", days: 0 },
      { month: "Mar", days: 2 },
      { month: "Apr", days: 1 },
      { month: "May", days: 0 },
      { month: "Jun", days: 2 }
    ],
    distribution: [
      { name: "CL", value: 4 },
      { name: "SL", value: 2 },
      { name: "LOP", value: 0 }
    ]
  }
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

/* -------------------- COMPONENT -------------------- */

export default function EmployeeDashboard() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const monthlyData = analyticsData[selectedYear]?.monthly || [];
  const distributionData =
    analyticsData[selectedYear]?.distribution || [];

  const totalLeaves = monthlyData.reduce(
    (acc, curr) => acc + curr.days,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-white p-12 border border-blue-100 shadow-sm">
  <div className="max-w-3xl space-y-4">
    <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
      Employee Overview
    </h1>
    <p className="text-gray-600 text-lg leading-relaxed">
      Monitor your leave usage, payroll trends and personal insights in one unified workspace.
    </p>
  </div>
</div>


        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MinimalStat
            icon={CalendarDays}
            title="Leave Balance"
            value="12 Days"
          />
          <MinimalStat
            icon={CheckCircle}
            title="Approved"
            value="5"
          />
          <MinimalStat
            icon={Clock}
            title="Pending"
            value="2"
          />
          <MinimalStat
            icon={FileText}
            title="Latest Payslip"
            value="Jan 2026"
          />
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-900">
                Leave Analytics
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total leaves taken in {selectedYear}:{" "}
                <span className="font-medium text-gray-800">
                  {totalLeaves} days
                </span>
              </p>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Line Chart */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium mb-6 text-gray-700">
                Monthly Leave Trend
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="days"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium mb-6 text-gray-700">
                Leave Type Distribution
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
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

        {/* Activity Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
          <h2 className="text-2xl font-medium mb-10 text-gray-900">
            Recent Activity
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-400 uppercase tracking-wider border-b">
                <th className="py-4">Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b text-sm hover:bg-gray-50 transition">
                <td className="py-5">CL</td>
                <td>12 Feb 2026</td>
                <td>13 Feb 2026</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="text-sm hover:bg-gray-50 transition">
                <td className="py-5">SL</td>
                <td>01 Jan 2026</td>
                <td>02 Jan 2026</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Approved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* -------------------- Minimal Stat Component -------------------- */

function MinimalStat({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
      <div className="bg-blue-50 p-3 rounded-xl">
        <Icon size={20} className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-900 mt-1">
          {value}
        </h3>
      </div>
    </div>
  );
}

