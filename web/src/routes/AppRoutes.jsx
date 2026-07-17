import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Layouts
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import ClinicAdminLayout from '../layouts/ClinicAdminLayout';
import RootLayout from '../layouts/RootLayout';

// Super Admin Pages
import SuperAdminDashboard from '../pages/SuperAdmin/SuperAdminDashboard';
import ClinicManagement from '../pages/SuperAdmin/ClinicManagement';
import AddClinic from '../pages/SuperAdmin/AddClinic';
import EditClinic from '../pages/SuperAdmin/EditClinic';
import ViewClinic from '../pages/SuperAdmin/ViewClinic';
import SuperAdminUserManagement from '../pages/SuperAdmin/UserManagement/UserManagement';
import SuperAdminAddUser from '../pages/SuperAdmin/UserManagement/AddUser';
import SuperAdminEditUser from '../pages/SuperAdmin/UserManagement/EditUser';
import SuperAdminViewUser from '../pages/SuperAdmin/UserManagement/ViewUser';

// Clinic Admin Pages
import ClinicAdminDashboard from '../pages/ClinicAdmin/Dashboard';
import UserManagement from '../pages/ClinicAdmin/UserManagement/UserManagement';
import AddUser from '../pages/ClinicAdmin/UserManagement/AddUser';
import EditUser from '../pages/ClinicAdmin/UserManagement/EditUser';
import ViewUser from '../pages/ClinicAdmin/UserManagement/ViewUser';
import Reports from '../pages/ClinicAdmin/Reports';
import ClinicInformation from '../pages/ClinicAdmin/ClinicInformation';
import Backup from '../pages/ClinicAdmin/Backup';

// Reports
import MonthlySummary from '../pages/Reports/MonthlySummary';
import HighRiskPatients from '../pages/Reports/HighRiskPatients';
import StaffActivity from '../pages/Reports/StaffActivity';
import AppointmentTrends from '../pages/Reports/AppointmentTrends';
import PatientRegistrations from '../pages/Reports/PatientRegistrations';

// Doctor Pages
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

// Nurse Pages
import NurseDashboard from '../pages/nurse/Dashboard';
import NursePatients from '../pages/nurse/Patients';
import ClinicVisits from '../pages/nurse/ClinicVisits';
import VitalSigns from '../pages/nurse/VitalSigns';
import Vaccinations from '../pages/nurse/Vaccinations';
import NurseInvestigations from '../pages/nurse/Investigations';
import Observations from '../pages/nurse/Observations';
import NursingNotes from '../pages/nurse/NursingNotes';

// Shared
import Profile from '../pages/shared/Profile';
import Settings from '../pages/shared/Settings';


const ProtectedRoute = ({ children, allowedUserTypes }) => {

  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (
    allowedUserTypes &&
    !allowedUserTypes.includes(userType)
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};



const Unauthorized = () => (
  <div style={{textAlign:"center", marginTop:"100px"}}>
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
  </div>
);



const AppRoutes = () => {

return (

<Routes>


{/* Public Routes */}

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/unauthorized" element={<Unauthorized />} />



{/* ================= SUPER ADMIN ================= */}

<Route
element={
<ProtectedRoute allowedUserTypes={['super_admin']}>
<SuperAdminLayout />
</ProtectedRoute>
}
>

<Route 
path="/super-admin"
element={<Navigate to="/super-admin/dashboard"/>}
/>

<Route 
path="/super-admin/dashboard"
element={<SuperAdminDashboard/>}
/>

<Route 
path="/super-admin/clinics"
element={<ClinicManagement/>}
/>

<Route 
path="/super-admin/clinics/add"
element={<AddClinic/>}
/>

<Route 
path="/super-admin/clinics/edit/:id"
element={<EditClinic/>}
/>

<Route 
path="/super-admin/clinics/view/:id"
element={<ViewClinic/>}
/>

<Route
path="/super-admin/users"
element={<SuperAdminUserManagement/>}
/>

<Route
path="/super-admin/users/add"
element={<SuperAdminAddUser/>}
/>

<Route
path="/super-admin/users/edit/:id"
element={<SuperAdminEditUser/>}
/>

<Route
path="/super-admin/users/view/:id"
element={<SuperAdminViewUser/>}
/>

</Route>



{/* ================= CLINIC ADMIN ================= */}

<Route
element={
<ProtectedRoute allowedUserTypes={['clinic_admin']}>
<ClinicAdminLayout/>
</ProtectedRoute>
}
>


<Route path="/" element={<Navigate to="/dashboard"/>}/>

<Route 
path="/dashboard"
element={<ClinicAdminDashboard/>}
/>

<Route path="/users" element={<UserManagement/>}/>

<Route path="/users/add" element={<AddUser/>}/>

<Route path="/users/edit/:id" element={<EditUser/>}/>

<Route path="/users/view/:id" element={<ViewUser/>}/>


<Route path="/reports" element={<Reports/>}/>

<Route path="/reports/monthly-summary" element={<MonthlySummary/>}/>

<Route path="/reports/high-risk-patients" element={<HighRiskPatients/>}/>

<Route path="/reports/staff-activity" element={<StaffActivity/>}/>

<Route path="/reports/appointment-trends" element={<AppointmentTrends/>}/>

<Route path="/reports/patient-registrations" element={<PatientRegistrations/>}/>


<Route path="/clinic" element={<ClinicInformation/>}/>

<Route path="/backup" element={<Backup/>}/>

</Route>





{/* ================= DOCTOR ================= */}

<Route
element={
<ProtectedRoute allowedUserTypes={['doctor']}>
<RootLayout/>
</ProtectedRoute>
}
>


<Route path="/doctor/dashboard" element={<DoctorDashboard/>}/>

<Route path="/doctor/patients" element={<DoctorPatients/>}/>

<Route path="/doctor/patient/:id" element={<PatientDetail/>}/>

<Route path="/doctor/medical-history" element={<MedicalHistory/>}/>

<Route path="/doctor/clinical-records" element={<ClinicalRecords/>}/>

<Route path="/doctor/diagnosis" element={<Diagnosis/>}/>

<Route path="/doctor/treatment" element={<Treatment/>}/>

<Route path="/doctor/investigations" element={<Investigations/>}/>

<Route path="/doctor/ultrasound" element={<Ultrasound/>}/>

<Route path="/doctor/appointments" element={<DoctorAppointments/>}/>


</Route>





{/* ================= NURSE ================= */}

<Route
element={
<ProtectedRoute allowedUserTypes={['nurse']}>
<RootLayout/>
</ProtectedRoute>
}
>


<Route path="/nurse/dashboard" element={<NurseDashboard/>}/>

<Route path="/nurse/patients" element={<NursePatients/>}/>

<Route path="/nurse/clinic-visits" element={<ClinicVisits/>}/>

<Route path="/nurse/vital-signs" element={<VitalSigns/>}/>

<Route path="/nurse/vaccinations" element={<Vaccinations/>}/>

<Route path="/nurse/investigations" element={<NurseInvestigations/>}/>

<Route path="/nurse/observations" element={<Observations/>}/>

<Route path="/nurse/nursing-notes" element={<NursingNotes/>}/>


</Route>




{/* Shared */}

<Route 
path="/profile"
element={<Profile/>}
/>

<Route
path="/settings"
element={<Settings/>}
/>



<Route
path="*"
element={<Navigate to="/login"/>}
/>


</Routes>

);

};


export default AppRoutes;