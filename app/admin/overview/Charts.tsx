"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import CONTENT_PAGE from "@/lib/content-page";

export default function Charts({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${CONTENT_PAGE.GLOBAL.currencySymbol}${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
