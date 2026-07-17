import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import PendingPatients from './pages/PendingPatients';
import SearchPatients from './pages/SearchPatients';
import Dashboard from './pages/Dashboard';

// --- NEW IMPORTS FOR GEOGRAPHY & ADMISSION ---
import PatientAdmissionForm from './pages/PatientAdmissionForm'; 
import MidwifeTerritoryView from './pages/MidwifeTerritoryView';

// Patient Specific Layout & Pages
import PatientLayout from './components/PatientLayout';
import MedicalHistory from './pages/MedicalHistory';
import ClinicCare from './pages/ClinicCare';
import PastObstetricHistory from './pages/PastObstetricHistory';
import RoutineLabs from './pages/RoutineLabs';
import BirthPlan from './pages/BirthPlan';
import DeliveryPNC from './pages/DeliveryPNC';

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
            
            {/* --- NEW ROUTES FOR ADMISSION & TERRITORY --- */}
            <Route path="/admit/:id" element={<PatientAdmissionForm />} />
            <Route path="/territory" element={<MidwifeTerritoryView />} />
            
            {/* Nested Patient Routes */}
            <Route path="/patient/:id" element={<PatientLayout />}>
               <Route path="medical-history" element={<MedicalHistory />} />
               <Route path="past-obstetric-history" element={<PastObstetricHistory />} />
               <Route path="clinic-care" element={<ClinicCare />} />
               <Route path="labs" element={<RoutineLabs />} />
               <Route path="birth-plan" element={<BirthPlan />} />
               <Route path="delivery-pnc" element={<DeliveryPNC />} /> 
            </Route>
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}