import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import RemarksPage from './pages/RemarksPage';
import InspectionsPage from './pages/InspectionsPage';
import StatisticsPage from './pages/StatisticsPage';
import SelectionsPage from './pages/SelectionsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RemarksPage />} />
          <Route path="/remarks" element={<RemarksPage />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/selections" element={<SelectionsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

