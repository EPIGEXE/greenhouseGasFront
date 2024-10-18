import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchEmissionData } from "@/store/YearlyEmissionSlice";
import { TotalEmissionChartCard } from "./module/TotalEmissionChartCard";
import { YearCircleChartCard } from "./module/YearCircleChartCard";
import { YearCategoryChartCard } from "./module/YearCategoryChartCard";

const YearlyEmission = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: totalEmission, status: totalEmissionStatus } = useSelector((state: RootState) => state.yearlyEmission.totalEmission);

  useEffect(() => {
    if(totalEmissionStatus === 'idle') {
      dispatch(fetchEmissionData());
    }
  }, [dispatch, totalEmissionStatus]);

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
        <div className='p-5 flex flex-col gap-4'>
          <div className='title text-2xl font-bold'>연간 온실가스 발생량</div>
          <TotalEmissionChartCard totalEmission={totalEmission} />

          <div className='flex-1 grid grid-cols-[3fr_7fr] gap-4'>
            <YearCircleChartCard />
            <YearCategoryChartCard />
          </div>

        </div>
      </main>
      
    </div>
  )
}

export default YearlyEmission;