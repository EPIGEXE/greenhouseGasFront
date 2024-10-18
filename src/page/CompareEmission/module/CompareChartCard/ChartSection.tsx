import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "../../../../components/common/ComboBox";
import { Separator } from "@radix-ui/react-separator";
import CompareChart from "./ChartSection/CompareChart";
import { useContext, useEffect } from "react";
import { YearlyChartDataContext } from "../../provider/YearlyChartDataProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { calculateCompareData, setCompareYear } from "@/store/CompareDataSlice";

const startYear = 1990;
const endYear = 2021;
const comboboxData = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
  const year = startYear + i;
  return {
    value: year.toString(),
    label: year.toString(),
  };
});

const ChartSection = ({
    section,
  }: {
    section: string,
  }) => {
    const {chartData, setChartYear, calculateChartData} = useContext(YearlyChartDataContext);
    const dispatch = useDispatch<AppDispatch>();
    const setCompareData = (year: string) => {
        dispatch(setCompareYear({ section: section, year: year }));
    }
    const { compareYear1, compareYear2 } = useSelector((state: RootState) => state.compareData);

    useEffect(() => {
        dispatch(calculateCompareData())
    }, [compareYear1, compareYear2])

    const handleComboboxSelect = (currentValue: string) => {
        setChartYear(currentValue)
        calculateChartData(parseInt(currentValue))
        setCompareData(currentValue)
    }

    return (
        <>
            <CardHeader className="pb-1">
                        
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>연간 배출량</CardTitle>
                        <CardDescription>국내 배출량 추이</CardDescription>
                    </div>
                    <div>
                        <Combobox
                            comboboxData={comboboxData} 
                            handleComboboxSelect={handleComboboxSelect}
                        />
                    </div>
                </div>
            </CardHeader>
            <Separator />

            <CardContent >  
                <CompareChart compareData={chartData} />  
            </CardContent>
        </>

    )
}

export default ChartSection;