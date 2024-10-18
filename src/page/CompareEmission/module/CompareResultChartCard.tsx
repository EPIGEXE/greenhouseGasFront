import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "../../../components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";


export function CompareResultChartCard() {
    const {compareData} = useSelector((state: RootState) => state.compareData);
    const [chartConfig, setChartConfig] = useState<Record<string, { label: string; color: string }>>({});

    const processedData = useMemo(() => {
        const threshold = compareData.reduce((sum, item) => sum + Math.abs(parseFloat(item.yearlyEmission.difference)), 0) / 100;
        let otherSum = 0;
        const mainData: any[] = [];
        
        compareData.forEach((item: any) => {
            const value = parseFloat(item.yearlyEmission.difference);
            if (Math.abs(value) < threshold) {
                otherSum += value;
            } else {
                mainData.push({
                    name: item.title,
                    value: value,
                    color: value < 0 ? "#82ca9d" : "#ff7300"
                });
            }
        });
        
        // 주요 데이터를 절대값 기준으로 내림차순 정렬
        mainData.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
        
        // '기타' 항목이 있으면 마지막에 추가
        if (otherSum !== 0) {
            mainData.push({
                name: "기타",
                value: otherSum,
                color: otherSum < 0 ? "#82ca9d" : "#ff7300"
            });
        }
        
        return mainData;
    }, [compareData]);

    useEffect(() => {
        const newChartConfig = compareData.reduce((config: any, item: any, index: number) => {
            config[item.title] = {
                label: item.title,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
            return config;
        }, {});
        setChartConfig(newChartConfig);
    }, [compareData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-1">
                        
                <CardTitle>연간 배출량</CardTitle>
                <CardDescription>국내 배출량 추이</CardDescription>

            </CardHeader>
            <Separator />

            <CardContent className="flex-1">  
                <ChartContainer key={JSON.stringify(processedData)} config={chartConfig} className="flex-1 h-full w-full">
                    <BarChart
                        layout="vertical"
                        accessibilityLayer
                        data={processedData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            type="number"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={150}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent className={cn("w-[150px]")} />}
                        />
                        <Bar dataKey="value" fill="#82ca9d">
                            {processedData.map((data, index) => (
                                <Cell key={`cell-${index}`} fill={data.color} /> // Cell을 사용하여 색상 설정
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
            </div>
            <div className="leading-none text-muted-foreground">
            </div>
        </CardFooter> */}
        </Card>
    )
}
