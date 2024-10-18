import { Bar, BarChart, CartesianGrid, Cell, Legend, Rectangle, XAxis, YAxis } from "recharts"

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
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { handleCategoryClick, handleTotalEmissionClick } from "@/store/YearlyEmissionSlice"

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
          <span>{chartConfig[entry.value as keyof typeof chartConfig].label}(톤 CO₂)</span>
        </li>
      ))}
    </ul>
  );
};

export function TotalEmissionChartCard({ totalEmission }: { totalEmission: any }) {
  const { selectedYear, selectedYearData, selectedCategoryData} = useSelector((state: RootState) => state.yearlyEmission);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if(selectedCategoryData.length === 0) {
      dispatch(handleCategoryClick("에너지"));
    }
  }, [selectedYearData])

  const handleBarClick = (data: any) => {
    dispatch(handleTotalEmissionClick(data.activeLabel));
  };

  const getBarOpacity = (entry: any) => {
    if(selectedYear){
      return selectedYear === entry ? 1 : 0.3;
    }
    return 0.6;
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>연간 배출량</CardTitle>
        <CardDescription>국내 배출량 추이</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={totalEmission}
            margin={{
              top: 20,
            }}
            onClick={handleBarClick}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(totalEmission) => totalEmission.slice(0, 4)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(totalEmission) => `${totalEmission.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent className={cn("w-[150px]")} />}
            />
            <Bar 
              dataKey="totalEmission" 
              barSize={20} 
              fill={"var(--color-desktop)"} 
              activeBar={<Rectangle fillOpacity={1}/>}
            >
              {totalEmission.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fillOpacity={getBarOpacity(entry.year)}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="lulucf" 
              barSize={20} 
              fill="var(--color-lulucf)" 
              activeBar={<Rectangle fillOpacity={1}/>}
            >
              {totalEmission.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fillOpacity={getBarOpacity(entry.year)}  
                />
              ))}
            </Bar>
            <Legend content={<CustomLegend />} />
          </BarChart>
          
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-end gap-2 text-xs">
        <div className="leading-none text-muted-foreground">
          {"* 2024년 대한민국 온실가스 인벤토리 기준"}
        </div>
      </CardFooter>
    </Card>
  )
}
