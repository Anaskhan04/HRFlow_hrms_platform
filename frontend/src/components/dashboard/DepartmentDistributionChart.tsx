import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building2, PieChart as PieChartIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { DepartmentDistributionItem } from "../../types";

interface DepartmentDistributionChartProps {
  data: DepartmentDistributionItem[];
}

const COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
];

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ data }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Building2 className="h-4 w-4" />
            </div>
            <span>Department Distribution</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Staff allocation across operational departments
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-500/20">
          <PieChartIcon className="h-3.5 w-3.5" />
          <span>{data.length} Units</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                }}
                formatter={(value: unknown) => [
                  `${value} Employees (${totalCount > 0 ? Math.round((Number(value) / totalCount) * 100) : 0}%)`,
                  "Headcount",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Clean Legend Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-1.5 px-1">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-medium text-foreground truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
