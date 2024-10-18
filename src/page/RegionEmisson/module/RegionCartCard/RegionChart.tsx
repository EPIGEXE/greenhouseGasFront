import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import regionPaths from "@/util/region.json";

interface RegionChartProps {
    selectedRegion: string | null;
}

const RegionChart = ({ selectedRegion }: RegionChartProps) => {
    const [regionsData, setRegionsData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const resGetTree = await fetch(`http://localhost:8080/api/v1/greenhouseGas/getReigonData`);
            const dataTree = await resGetTree.json();

            const formattedData = dataTree.data.reduce((acc: {[key: string]: {name: string, value: number}[]}, item: any) => {
                acc[item.region] = Object.entries(item.yearlyEmission).map(([year, value]) => ({
                    name: year,
                    value: parseInt(value as string, 10)
                })).sort((a, b) => a.name.localeCompare(b.name));
                return acc;
            }, {});

            setRegionsData(formattedData[selectedRegion || '']);
        }
        fetchData();
    }, [selectedRegion])

    const chartConfig = {
        value: {
          label: "배출량",
          color: "hsl(var(--chart-1))",
        },
      } satisfies ChartConfig;

    const getRegionName = (regionId: string) => {
        const region = regionPaths.find(r => r.id === regionId);
        return region ? region.title : undefined;
    };

    return (
        <>
            <div className="text-2xl font-bold">{getRegionName(selectedRegion || '')}</div>
            <ChartContainer config={chartConfig}>
                <BarChart
                    accessibilityLayer
                    data={regionsData}
                    margin={{
                    top: 20,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                    <YAxis
                    axisLine={false}
                    tickLine={false}
                    />
                    <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent className={cn("w-[150px]")} />}
                    />
                    <Bar
                    dataKey="value" 
                    fill={"var(--color-desktop)"} 
                    >
                    </Bar>
                </BarChart>
            </ChartContainer>
        </>
    )
}

export default RegionChart