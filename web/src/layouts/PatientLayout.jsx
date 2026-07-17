import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  User, Calendar, Heart, ClipboardList, 
  FileText, Activity, Baby, Stethoscope,
  Pill, TestTube, ChevronRight
} from 'lucide-react';
import { patients } from '../data/patients';

export default function PatientLayout() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Fetch patient from hardcoded data
    const found = patients.find(p => p.id === parseInt(id));
    setPatient(found);
  }, [id]);

  const sections = [
    { 
      name: 'Medical History', 
      path: `/doctor/patient/${id}/medical-history`,
      icon: ClipboardList
    },
    { 
      name: 'Pregnancy Information', 
      path: `/doctor/patient/${id}/pregnancy`,
      icon: Baby
    },
    { 
      name: 'Clinical Records', 
      path: `/doctor/patient/${id}/clinical-records`,
      icon: FileText
    },
    { 
      name: 'Vital Signs', 
      path: `/doctor/patient/${id}/vital-signs`,
      icon: Heart
    },
    { 
      name: 'Investigations', 
      path: `/doctor/patient/${id}/investigations`,
      icon: TestTube
    },
    { 
      name: 'Treatment Plan', 
      path: `/doctor/patient/${id}/treatment`,
      icon: Pill
    }
  ];

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full gap-6 pb-10">
      {/* Patient Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-pink-700">
              {patient.firstName[0]}{patient.lastName[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-pink-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Patient ID: #{id}</span>
              <span>•</span>
              <span>{patient.age} years</span>
              <span>•</span>
              <span>Blood Group: {patient.bloodGroup}</span>
              {patient.pregnancy.highRisk && (
                <>
                  <span>•</span>
                  <span className="text-red-500 font-medium">⚠️ High Risk</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-pink-50 rounded-3xl p-4 sticky top-0 border border-pink-100">
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <NavLink
                key={section.name}
                to={section.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
                    isActive 
                      ? 'bg-white text-pink-700 shadow-sm border border-pink-200' 
                      : 'text-pink-800 hover:bg-pink-100'
                  }`
                }
              >
                <section.icon size={18} className="text-pink-500" />
                <span className="text-sm">{section.name}</span>
                <ChevronRight size={14} className={`ml-auto ${({ isActive }) => isActive ? 'opacity-100' : 'opacity-0'}`} />
              </NavLink>
            ))}
          </nav>

          {/* Quick Info */}
          <div className="mt-4 pt-4 border-t border-pink-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-pink-700">{patient.pregnancy.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Weeks</span>
                <span className="font-medium text-pink-700">{patient.pregnancy.weeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium text-pink-700">{patient.pregnancy.dueDate}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}