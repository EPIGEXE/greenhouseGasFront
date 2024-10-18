import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './page/Layout';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CompareEmission from './page/CompareEmission/CompareEmission';
import RegionEmission from './page/RegionEmisson/RegionEmission';
import YearlyEmission from './page/YearlyEmission/YearlyEmission';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}>
          <Route index element={<YearlyEmission isCollapsed={isCollapsed} />} />
          <Route path="/compareEmission" element={<CompareEmission isCollapsed={isCollapsed} />} />
          <Route path="/regionEmission" element={<RegionEmission isCollapsed={isCollapsed} />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
