export default function EmployeeOverview() {
  return (
    <div className="space-y-16">

      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Employee Overview
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Manage your leave requests and payroll from your workspace.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
        <h2 className="text-2xl font-medium mb-8 text-gray-900">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          Your recent leave and payroll updates will appear here.
        </p>
      </div>

    </div>
  );
}