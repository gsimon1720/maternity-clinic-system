import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MidwifeTerritoryView() {
  const [territory, setTerritory] = useState({ "Zone A": [], "Zone B": [], "Zone C": [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will fetch territory for Midwife ID 1 for now
    const fetchTerritory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/midwife/1/territory');
        setTerritory(res.data);
      } catch (err) {
        console.error("Error fetching territory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerritory();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Map...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Midwife Territory Map</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(territory).map(zone => (
          <div key={zone} className="bg-white p-4 rounded-lg shadow border-t-4 border-indigo-500">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-700">{zone}</h2>
            
            {territory[zone].length === 0 ? (
              <p className="text-gray-500 italic text-sm">No patients assigned to this zone yet.</p>
            ) : (
              <ul className="space-y-3">
                {territory[zone].map(patient => (
                  <li key={patient.patient_id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-semibold text-gray-800">{patient.first_name} {patient.last_name}</p>
                    <p className="text-sm text-gray-600">Contact: {patient.contact_number}</p>
                    {patient.assigned_visit_day && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                        Visit Day: {patient.assigned_visit_day}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}