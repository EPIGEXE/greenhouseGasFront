import { useState } from 'react'
import './App.css'
import { TooltipProvider } from './components/ui/tooltip';
import Sidebar from './components/test/Sidebar';
import { BarChartCard } from './components/test/BarChartCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';


function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen w-full flex flex-col">
        <header className='bg-gray-800 text-white p-4 h-16 flex items-center'>header</header>
        <div className='relative flex flex-1'>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className='flex flex-col flex-1'>
            <main
              className={`
                max-h-[calc(100vh-4rem)]
                overflow-y-auto
                transition-all duration-300 ease-in-out 
                flex flex-col flex-1 p-3 ${isCollapsed ? 'pl-[8.33%]' : 'pl-[16.67%]'}
              `}
            >
              <div className='p-8 flex flex-col'>
                <div className='title text-3xl font-bold mb-4'>제목이 들어갈 부분</div>
                {/* <div className='flex-1 grid grid-cols-3 gap-4'>
                  <BarChartCard />
                  <BarChartCard />
                  <BarChartCard />
                </div> */}
                <div className='flex-1 grid grid-cols-2 gap-4'>
                  <BarChartCard />
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card Content</p>
                    </CardContent>
                  </Card>
                </div>

              </div>
              <footer className={`
                h-10 flex items-center justify-center
                text-gray-500 p-4 text-center 
              `}>
                 <div>© 2024 ymKim</div>
              </footer>
            </main>
            
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}

export default App
