import { AppDispatch } from "@/store/store";
import { CompareChartCard } from "./module/CompareChartCard";
import { CompareResultChartCard } from "./module/CompareResultChartCard";
import { useDispatch } from "react-redux";
import { setCompareData, setCompareYear } from "@/store/CompareDataSlice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CompareEmission = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    useEffect(() => {
        dispatch(setCompareYear({section: "first", year: ""}));
        dispatch(setCompareYear({section: "second", year: ""}));
        dispatch(setCompareData([]));
    }, [location, dispatch])

    return (
        <div className='flex flex-col flex-1'>
            <main
                className={`
                    max-h-[calc(100vh-4rem)]
                    overflow-y-auto
                    transition-all duration-300 ease-in-out 
                    flex flex-col flex-1 p-3 ${isCollapsed ? 'pl-[75px]' : 'pl-[250px]'}
                `}  
            >
                <div className='p-5 flex flex-1 flex-col gap-4'>
                    <div className='title text-2xl font-bold'>온실가스 발생량 비교</div>
                    <div className='flex-1 grid grid-cols-[1fr_1fr] gap-4'>
                        <CompareChartCard />
                        <CompareResultChartCard />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CompareEmission;