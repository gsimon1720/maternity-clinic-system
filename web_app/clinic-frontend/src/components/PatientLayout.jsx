import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';

export default function PatientLayout() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  // Fetch patient name when component loads
  useEffect(() => {
    axios.get(`http://localhost:5000/api/patients/details/${id}`)
      .then(res => setPatient(res.data))
      .catch(err => console.error("Error fetching patient name:", err));
  }, [id]);

  const sections = [
    { name: 'Medical History', path: `/patient/${id}/medical-history` },
    { name: 'Past Obstetric History', path: `/patient/${id}/past-history` },
    { name: 'Clinic Care', path: `/patient/${id}/clinic-care` },
    { name: 'Lab Tests', path: `/patient/${id}/labs` },
    { name: 'Birth Plan', path: `/patient/${id}/birth-plan` }
  ];

  return (
    // 1. Removed 'h-full' and used 'min-h-full' so it can grow
    <div className="flex flex-col min-h-full gap-6 pb-10">
      
      {/* Patient Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
        <h1 className="text-3xl font-bold text-pink-900">
          {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
        </h1>
        <p className="text-gray-500 font-medium">Patient ID: #{id}</p>
      </div>

      
      <div className="flex gap-8 items-start">
        
        {/* SIDEBAR: Added 'sticky top-0' so it scrolls with you! */}
        <aside className="w-64 shrink-0 bg-pink-100 rounded-3xl p-4 sticky top-0">
          <nav className="flex flex-col gap-2">
            {sections.map((section) => (
              <NavLink
                key={section.name}
                to={section.path}
                className={({ isActive }) =>
                  `p-4 rounded-2xl font-medium transition-all ${
                    isActive 
                      ? 'bg-white text-pink-700 shadow-sm' 
                      : 'text-pink-900 hover:bg-pink-200'
                  }`
                }
              >
                {section.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* CONTENT AREA: This will now stretch fully to wrap the whole form */}
        <main className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
