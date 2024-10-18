"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { handleCategoryClick } from "@/store/YearlyEmissionSlice"

interface ChartConfigItem {
  label: string;
  color: string;
}

interface ChartConfig {
  [key: string]: ChartConfigItem;
}

interface ChartDataItem {
  section: string;
  percentage: number;
  percentageText: string;
  emission: number;
  fill: string;
}

export function YearCircleChartCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedYear, selectedYearData} = useSelector((state: RootState) => state.yearlyEmission);
  
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [chartKey, setChartKey] = useState(0);

  const handleCircleClick = (data: any) => {
    dispatch(handleCategoryClick(data.name));
  };

  useEffect(() => {
    setChartData(selectedYearData.map((item: any) => ({
      section: item.title,
      percentage: item.percentage,
      percentageText: `${item.percentage}%`,
      emission: item.year,
      fill: `var(--color-${item.title})`,
    })));

    const newChartConfig = selectedYearData.reduce((config: any, item: any, index: number) => {
      config[item.title] = {
        label: item.title,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    }, {});

    setChartKey(prevKey => prevKey + 1); // chartData가 변경될 때마다 key 증가
    setChartConfig(newChartConfig);
  }, [selectedYearData]);
  
  return (
    <Card >
      <CardHeader>
        <CardTitle> 온실가스 배출 비율</CardTitle>
        <CardDescription>{selectedYear}년 기준</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}  className="aspect-auto h-[250px] w-full">
        <PieChart >
        <ChartTooltip
              content={
                <ChartTooltipContent 
                  valueKey="percentageText"
                  hideLabel 
                />
              }
            />
            <Pie
              key={chartKey}
              data={chartData}
              dataKey="percentage"
              labelLine={false}
              onClick={handleCircleClick}
              animationDuration={300}
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
    </Card>
  )
}
