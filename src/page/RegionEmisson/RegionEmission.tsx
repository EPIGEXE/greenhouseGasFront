import { RegionCartCard } from "./module/RegionCartCard";

const RegionEmission = ({ isCollapsed }: { isCollapsed: boolean }) => {
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
                    <div className='title text-2xl font-bold'>지역별 배출량</div>
                    <div className='flex-1 grid grid-cols-[5fr_2fr] gap-4'>
                        <RegionCartCard />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RegionEmission;