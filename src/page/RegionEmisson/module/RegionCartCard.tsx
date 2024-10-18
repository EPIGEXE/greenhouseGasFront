import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { SouthKoreaMap } from "./RegionCartCard/SouthKoreaMap"
import RegionChart from "./RegionCartCard/RegionChart"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedRegion } from "@/store/RegionDataSlice";
  
  
  export function RegionCartCard() {
    const dispatch = useDispatch();
    const { selectedRegion } = useSelector((state: RootState) => state.regionData);
    const setSelectedRegionData = (region: string | null) => {
        dispatch(setSelectedRegion(region));
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader >
                <CardTitle>연간 배출량</CardTitle>
                <CardDescription>국내 배출량 추이</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 grid grid-cols-[1fr_1fr] gap-4">
                <div className="h-full w-full">
                    <SouthKoreaMap selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegionData} />
                </div>
                <div className="w-full h-full flex flex-col justify-start">
                    <RegionChart selectedRegion={selectedRegion} />
                </div>
            </CardContent>
        </Card>
      )
  }
  