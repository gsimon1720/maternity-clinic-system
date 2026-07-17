import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import RootLayout from '../layouts/RootLayout';
import DoctorDashboard from '../pages/doctor/Dashboard';
import DoctorPatients from '../pages/doctor/Patients';
import PatientDetail from '../pages/doctor/PatientDetail';
import MedicalHistory from '../pages/doctor/MedicalHistory';
import ClinicalRecords from '../pages/doctor/ClinicalRecords';
import Diagnosis from '../pages/doctor/Diagnosis';
import Treatment from '../pages/doctor/Treatment';
import Investigations from '../pages/doctor/Investigations';
import Ultrasound from '../pages/doctor/Ultrasound';
import DoctorAppointments from '../pages/doctor/Appointments';
import NurseDashboard from '../pages/nurse/Dashboard';
import NursePatients from '../pages/nurse/Patients';
import ClinicVisits from '../pages/nurse/ClinicVisits';
import VitalSigns from '../pages/nurse/VitalSigns';
import Vaccinations from '../pages/nurse/Vaccinations';
import NurseInvestigations from '../pages/nurse/Investigations';
import Observations from '../pages/nurse/Observations';
import NursingNotes from '../pages/nurse/NursingNotes';
import Profile from '../pages/shared/Profile';
import Settings from '../pages/shared/Settings';

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const role = user.role;
  const isDoctor = role === 'doctor';
  const isNurse = role === 'nurse';

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Doctor Routes */}
        {isDoctor && (
          <>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/patient/:id" element={<PatientDetail />} />
            <Route path="/doctor/medical-history" element={<MedicalHistory />} />
            <Route path="/doctor/clinical-records" element={<ClinicalRecords />} />
            <Route path="/doctor/diagnosis" element={<Diagnosis />} />
            <Route path="/doctor/treatment" element={<Treatment />} />
            <Route path="/doctor/investigations" element={<Investigations />} />
            <Route path="/doctor/ultrasound" element={<Ultrasound />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          </>
        )}

        {/* Nurse Routes */}
        {isNurse && (
          <>
            <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            <Route path="/nurse/patients" element={<NursePatients />} />
            <Route path="/nurse/clinic-visits" element={<ClinicVisits />} />
            <Route path="/nurse/vital-signs" element={<VitalSigns />} />
            <Route path="/nurse/vaccinations" element={<Vaccinations />} />
            <Route path="/nurse/investigations" element={<NurseInvestigations />} />
            <Route path="/nurse/observations" element={<Observations />} />
            <Route path="/nurse/nursing-notes" element={<NursingNotes />} />
          </>
        )}

        {/* Shared Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Redirect */}
        <Route
          path="*"
          element={<Navigate to={isDoctor ? '/doctor/dashboard' : '/nurse/dashboard'} replace />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;