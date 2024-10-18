"use client"

import { Bar, BarChart, CartesianGrid, Cell, Legend, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export const description = "A bar chart with a label"

const colorPalette = [
  "#82ca9d", // 색상 1 (연한 녹색)
  "#ffc658", // 색상 2 (연한 노란색)
  "#ff6347", // 색상 3 (토마토색)
  "#6a5acd", // 색상 4 (슬레이트 블루)
  "#20b2aa", // 색상 5 (라이트 씨 그린)
  "#ff69b4", // 색상 6 (핫핑크)
  "#cd5c5c", // 색상 7 (인디언 레드)
  "#4682b4", // 색상 8 (스틸 블루)
  "#9acd32", // 색상 9 (옐로우그린)
  "#f4a460"  // 색상 10 (샌디 브라운)
];

const chartConfig = {
  lulucf: {
    label: "LULUCF",
    color: "hsl(var(--chart-2))",
  },
  totalEmission: {
    label: "총 배출량",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex justify-end list-none p-0">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="inline-flex items-center mr-4">
          <span style={{ backgroundColor: entry.color, width: 10, height: 10, display: 'inline-block', marginRight: 5 }}></span>
          {/* <span>{chartConfig[entry.value].label}(톤 CO₂)</span> */}
        </li>
      ))}
    </ul>
  );
};

const processData = (data: any[], year: string) => {
  const result = [];

  let totalEmission = 0;
  let count = 0;

  // 1단계: 전체 배출량 합계와 자식 개수를 계산
  data.forEach((parent: any) => {
    parent.children.forEach((child: any) => {
      const childEmission = parseFloat(child.yearlyEmission[year]);
      if (!isNaN(childEmission)) {
        totalEmission += childEmission;
        count++;
      }
    });
  });

  // 평균 계산
  const averageEmission = totalEmission / count;
  const threshold = averageEmission / 5; // 2/10 기준

  let othersEmission = 0; // 기타 배출량
  data.forEach((parent, index) => {
    const parentColor = colorPalette[index % colorPalette.length]; // 부모 색상 결정

    parent.children.forEach((child: any) => {
      const childEmission = parseFloat(child.yearlyEmission[year]);

      if (!isNaN(childEmission)) {
        if (childEmission < threshold) {
          // 2단계: 기준 이하 배출량은 "기타"로 합산
          othersEmission += childEmission;
        } else {
          // 3단계: 기준을 충족하는 데이터는 그대로 추가
          result.push({
            name: parent.title, // 부모의 제목
            child: child.title, // 자식의 제목
            emission: childEmission, // 자식의 배출량
            color: parentColor, // 부모 색상 추가
          });
        }
      }
    });
  });

  // 4단계: 기타 배출량이 존재할 경우 추가
  if (othersEmission > 0) {
    result.push({
      name: "기타", // 부모와 상관없는 "기타" 그룹
      child: "기타",
      emission: othersEmission, // 기타 배출량 합산
      color: "#cccccc", // 기타 항목 색상 지정
    });
  }

  return result;
};

export function YearCategoryChartCard() {
  const { selectedYear, selectedCategoryData } = useSelector((state: RootState) => state.yearlyEmission);
  const [processedData, setProcessedData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCategoryData.length > 0) {
      const processedData = processData(selectedCategoryData, selectedYear);
      setProcessedData(processedData);
    }
  }, [selectedCategoryData, selectedYear]);

  return (
    <Card >
      <CardHeader>
        <CardTitle>연간 배출량</CardTitle>
        <CardDescription>국내 배출량 추이</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={processedData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="child"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(emission) => `${emission.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent className={cn("w-[150px]")} />}
            />
            <Bar dataKey="emission" fill="#82ca9d">
              {processedData.map((data, index) => (
                <Cell key={`cell-${index}`} fill={data.color} /> // Cell을 사용하여 색상 설정
              ))}
            </Bar>
            <Legend content={<CustomLegend />} />
          </BarChart>
          
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
