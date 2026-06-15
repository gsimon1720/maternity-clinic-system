import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import PendingPatients from './pages/PendingPatients';
import SearchPatients from './pages/SearchPatients';
import Dashboard from './pages/Dashboard'; // This is your new stats page

// Patient Specific Layout & Pages
import PatientLayout from './components/PatientLayout';
import MedicalHistory from './pages/MedicalHistory';
import ClinicCare from './pages/ClinicCare';
import PastObstetricHistory from './pages/PastObstetricHistory';
import RoutineLabs from './pages/RoutineLabs';
import BirthPlan from './pages/BirthPlan';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        
        {isAuthenticated ? (
          <Route element={<DashboardLayout />}>
            {/* NEW DASHBOARD ROUTES */}
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/pending" element={<PendingPatients />} />
            <Route path="/search" element={<SearchPatients />} />
            
            {/* Nested Patient Routes */}
            <Route path="/patient/:id" element={<PatientLayout />}>
               <Route path="medical-history" element={<MedicalHistory />} />
               <Route path="past-history" element={<PastObstetricHistory />} />
               <Route path="clinic-care" element={<ClinicCare />} />
               <Route path="labs" element={<RoutineLabs />} />
               <Route path="birth-plan" element={<BirthPlan />} />
            </Route>
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}