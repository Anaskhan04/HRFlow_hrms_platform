import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Wallet, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { PayrollDistributionItem } from "../../types";

interface PayrollDistributionChartProps {
  data: PayrollDistributionItem[];
}

const BAR_COLORS = [
  "#0d9488", // Teal
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
];

export const PayrollDistributionChart: React.FC<PayrollDistributionChartProps> = ({ data }) => {
  return (
    <Card className="border bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Wallet className="h-4 w-4" />
            </div>
            <span>Payroll Distribution by Department</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Monthly net salary expenditure broken down by operational unit
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-teal-500/20">
          <DollarSign className="h-3.5 w-3.5" />
          <span>Salary Allocation</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
              <XAxis
                dataKey="department"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => `$${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                }}
                labelStyle={{ fontWeight: 600, color: "#94a3b8", fontSize: "0.75rem" }}
                formatter={(value: unknown, _, props: { payload?: { headcount?: number } }) => [
                  `${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(Number(value))} (${props.payload?.headcount || 0} staff)`,
                  "Monthly Net Salary",
                ]}
              />
              <Bar dataKey="netSalary" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
