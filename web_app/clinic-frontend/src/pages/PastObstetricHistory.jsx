import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function PastObstetricHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    pregnancy_number: '', year_of_birth: '', outcome: 'Live Birth', sex: 'Male', birth_weight: '', mode_of_delivery: 'Normal', complications: ''
  });

  const fetchHistory = async () => {
    const res = await axios.get(`http://localhost:5000/api/past-obstetric-history/${id}`);
    setHistory(res.data);
  };

  useEffect(() => { fetchHistory(); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/past-obstetric-history', { patient_id: id, ...formData });
      fetchHistory(); // Refresh the table
      // Reset form, incrementing pregnancy number for convenience
      setFormData({
        pregnancy_number: parseInt(formData.pregnancy_number) + 1 || '', year_of_birth: '', outcome: 'Live Birth', sex: 'Male', birth_weight: '', mode_of_delivery: 'Normal', complications: ''
      });
    } catch (err) {
      alert("Error adding record. Check if this pregnancy number already exists.");
    }
  };

  return (
    <div>
      {/* ADD NEW RECORD FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Add Past Pregnancy Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          <input required type="number" placeholder="Pregnancy No. (e.g., 1)" className="border p-2 rounded" value={formData.pregnancy_number} onChange={e => setFormData({...formData, pregnancy_number: e.target.value})} />
          <input required type="number" placeholder="Year (e.g., 2021)" className="border p-2 rounded" value={formData.year_of_birth} onChange={e => setFormData({...formData, year_of_birth: e.target.value})} />
          
          <select className="border p-2 rounded" value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})}>
            <option value="Live Birth">Live Birth</option>
            <option value="Stillbirth">Stillbirth</option>
            <option value="Miscarriage">Miscarriage</option>
            <option value="Abortion">Abortion</option>
          </select>

          <select className="border p-2 rounded" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>

          <input placeholder="Birth Weight (kg)" type="number" step="0.1" className="border p-2 rounded" value={formData.birth_weight} onChange={e => setFormData({...formData, birth_weight: e.target.value})} />
          
          <select className="border p-2 rounded" value={formData.mode_of_delivery} onChange={e => setFormData({...formData, mode_of_delivery: e.target.value})}>
            <option value="Normal">Normal Delivery</option>
            <option value="C-Section">C-Section</option>
            <option value="Vacuum">Vacuum</option>
            <option value="Forceps">Forceps</option>
          </select>

          <input placeholder="Complications (if any)" className="border p-2 rounded col-span-2" value={formData.complications} onChange={e => setFormData({...formData, complications: e.target.value})} />
          
          <Button type="submit" className="col-span-4">Save Past Record</Button>
        </form>
      </div>

      {/* DATA TABLE */}
      <h3 className="text-xl font-bold mb-4">Past Obstetric Records</h3>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Preg. No.</th>
              <th className="p-3">Year</th>
              <th className="p-3">Outcome</th>
              <th className="p-3">Sex</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Complications</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center text-gray-500">No past obstetric history recorded.</td></tr>
            ) : (
              history.map(h => (
                <tr key={h.history_id} className="border-b">
                  <td className="p-3 font-bold text-blue-600">G{h.pregnancy_number}</td>
                  <td className="p-3">{h.year_of_birth}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${h.outcome === 'Live Birth' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {h.outcome}
                    </span>
                  </td>
                  <td className="p-3">{h.sex}</td>
                  <td className="p-3">{h.birth_weight ? `${h.birth_weight} kg` : '-'}</td>
                  <td className="p-3">{h.mode_of_delivery}</td>
                  <td className="p-3">{h.complications || 'None'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}