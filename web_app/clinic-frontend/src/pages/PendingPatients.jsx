import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';

export default function PendingPatients() {
  const [patients, setPatients] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get('http://localhost:5000/api/patients/pending');
    setPatients(res.data);
  };

  useEffect(() => { fetchPending(); }, []);

  const confirmPatient = async (id) => {
    await axios.put(`http://localhost:5000/api/patients/confirm/${id}`);
    fetchPending();
    alert("Pregnancy Confirmed. Patient added to active registry.");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Mobile Registrations</h1>
      <div className="grid gap-4">
        {patients.map(p => (
          <div key={p.patient_id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center border-l-4 border-yellow-500">
            <div>
              <h3 className="text-xl font-semibold">{p.first_name} {p.last_name}</h3>
              <p className="text-gray-600">Age: {p.age} | Contact: {p.contact_number}</p>
            </div>
            <button onClick={() => confirmPatient(p.patient_id)} type="submit">
              Confirm Pregnancy
            </button>
          </div>
        ))}
        {patients.length === 0 && <p>No pending patients from the mobile app.</p>}
      </div>
    </div>
  );
}