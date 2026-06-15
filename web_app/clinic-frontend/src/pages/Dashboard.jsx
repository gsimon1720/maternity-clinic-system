import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [data, setData] = useState({
    totalPatients: 0,
    recentVisits: 0,
    alerts: [],
    missingPlans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-pink-500 font-bold text-center mt-10 text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center border-b-2 border-pink-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-900">Clinic Dashboard</h1>
          <p className="text-pink-700 mt-1">Overview of maternal health records and active alerts.</p>
        </div>
        <Link 
          to="/pending" 
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all"
        >
          + Register Patient
        </Link>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="text-pink-600 font-bold text-lg uppercase tracking-wider mb-2">Total Registered</h3>
          <span className="text-5xl font-extrabold text-pink-900">{data.totalPatients}</span>
          <p className="text-sm text-pink-500 mt-2">Active maternal records</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="text-pink-600 font-bold text-lg uppercase tracking-wider mb-2">Recent Visits</h3>
          <span className="text-5xl font-extrabold text-pink-900">{data.recentVisits}</span>
          <p className="text-sm text-pink-500 mt-2">Clinic checks in the last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="text-amber-600 font-bold text-lg uppercase tracking-wider mb-2">Active Alerts</h3>
          <span className="text-5xl font-extrabold text-amber-700">{data.alerts.length}</span>
          <p className="text-sm text-amber-500 mt-2">High BP cases needing review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* HIGH RISK ALERTS */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-red-50">
            <h3 className="text-xl font-bold text-red-900">High Blood Pressure Alerts</h3>
            <p className="text-sm text-red-700">Patients recording BP ≥ 140/90</p>
          </div>
          <div className="p-0">
            {data.alerts.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {data.alerts.map((alert, idx) => (
                  <li key={idx} className="p-6 hover:bg-red-50/50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{alert.first_name} {alert.last_name}</p>
                      <p className="text-sm text-gray-500">Visit Date: {new Date(alert.visit_date).toLocaleDateString()} (POA: {alert.poa || 'N/A'})</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-red-100 text-red-800 font-extrabold px-3 py-1 rounded-full text-lg">
                        {alert.bp_systolic} / {alert.bp_diastolic}
                      </span>
                      <Link to={`/patient/${alert.patient_id}/clinic-care`} className="block text-sm text-pink-600 font-bold mt-2 hover:underline">
                        View Chart &rarr;
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-400 italic">No active blood pressure alerts.</div>
            )}
          </div>
        </div>

        {/* PENDING TASKS: MISSING BIRTH PLANS */}
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="p-6 border-b border-amber-100 bg-amber-50">
            <h3 className="text-xl font-bold text-amber-900">Missing Birth Plans</h3>
            <p className="text-sm text-amber-700">Patients requiring emergency preparedness setup</p>
          </div>
          <div className="p-0">
            {data.missingPlans.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {data.missingPlans.map((patient, idx) => (
                  <li key={idx} className="p-6 hover:bg-amber-50/50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{patient.first_name} {patient.last_name}</p>
                      <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
                    </div>
                    <Link 
                      to={`/patient/${patient.patient_id}/birth-plan`} 
                      className="bg-amber-100 text-amber-800 font-bold px-4 py-2 rounded-xl hover:bg-amber-200 transition-colors"
                    >
                      Fill Plan
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-400 italic">All current patients have birth plans!</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}