// import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-white mt-3">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Icon className="text-white" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

