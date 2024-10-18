import { createContext, useState } from "react";

type YearlyChartDataContextType = {
    chartYear: string;
    setChartYear: (year: string) => void;
    chartData: any[];
    calculateChartData: (year: number) => void;
    selectedCategoryData: any[];
    handleCategoryClick: (category: any) => void;
};

const initialContextValue: YearlyChartDataContextType = {
    chartYear: "",
    setChartYear: () => {},
    chartData: [],
    calculateChartData: () => {},
    selectedCategoryData: [],
    handleCategoryClick: () => {},
};

export const YearlyChartDataContext = createContext<YearlyChartDataContextType>(initialContextValue);

export const YearlyChartDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartYear, setChartYear] = useState<string>("");
    const [selectedCategoryData, setSelectedCategoryData] = useState<any[]>([]);

    const calculateChartData = (year: number) => {
        const fetchData = async () => {
            const resGetTree = await fetch(`http://localhost:8080/api/v1/greenhouseGas/getGreenhouseGasInventoryTreeByTitle?title=${encodeURIComponent("총배출량(Gg CO2eq)")}`);
            const dataTree = await resGetTree.json();
    
            // 먼저 각 항목의 배출량을 계산
            const childData = dataTree.data.map((item: any) => ({
                title: item.title,
                emission: parseFloat(item.yearlyEmission[year]) || 0
            }));
    
            // 총 배출량 계산
            const totalEmissionForYear = childData.reduce((total: any, item: any) => total + item.emission, 0);
    
            // 백분율 계산 및 최종 데이터 형성
            const filteredChildData = childData.map((item: any) => ({
                title: item.title,
                [year]: item.emission,
                percentage: parseFloat(((item.emission / totalEmissionForYear) * 100).toFixed(0))
            }));
    
            setChartData(filteredChildData);
        }
    
        fetchData();
    }

    const handleCategoryClick = (category: any) => {
        const fetchData = async () => {
            const resGetTree = await fetch(`http://localhost:8080/api/v1/greenhouseGas/getGreenhouseGasInventoryTreeByTitle?title=${encodeURIComponent(category)}`);
            const dataTree = await resGetTree.json();

            setSelectedCategoryData(dataTree.data);
        }
        fetchData();
    }

    return (
        <YearlyChartDataContext.Provider value={{
            chartYear,
            setChartYear,
            chartData, 
            calculateChartData,
            selectedCategoryData,
            handleCategoryClick,
        }}>
            {children}
        </YearlyChartDataContext.Provider>
    )
}