"use client"

import { TrendingUp } from "lucide-react"
import { Bar, LabelList, Pie, PieChart, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ]

const chartData = [
    { section: "energy", percentage: 25, percentageText: '25%', fill: "var(--color-energy)" },
    { section: "manufacturing", percentage: 18, percentageText: '18%', fill: "var(--color-manufacturing)" },
    { section: "farming", percentage: 17, percentageText: '17%', fill: "var(--color-farming)" },
    { section: "mining", percentage: 16, percentageText: '16%', fill: "var(--color-mining)" },
    { section: "other", percentage: 24, percentageText: '24%', fill: "var(--color-other)" },
  ]

  const chartConfig = {
    percentage: {
      label: "비율",
    },
    energy: {
      label: "에너지",
      color: "hsl(var(--chart-1))",
    },
    manufacturing: {
      label: "제조업",
      color: "hsl(var(--chart-2))",
    },
    farming: {
      label: "농업",
      color: "hsl(var(--chart-3))",
    },
    mining: {
      label: "광업",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "기타",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  const handleClick = (data: any, index: number) => {
    console.log("Clicked item:", data, "at index:", index);
  };

export function CircleChartCard() {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}>
        <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent className="text-lg" nameKey="percentage" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              labelLine={false}
              onClick={handleClick}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {`${
                      chartConfig[payload.section as keyof typeof chartConfig]
                        ?.label
                    } (${payload.percentage}%)`}
                  </text>
                )
              }}
              nameKey="section"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
