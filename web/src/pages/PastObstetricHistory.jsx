import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function PastObstetricHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  const initialForm = {
    pregnancy_number: '', 
    year_of_birth: '', 
    outcome: 'Live Birth', 
    sex: 'Male', 
    birth_weight: '', 
    mode_of_delivery: 'Normal', 
    complications: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/past-obstetric-history/${id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching past obstetric history:", err);
    }
  };

  useEffect(() => { fetchHistory(); }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/past-obstetric-history', { patient_id: id, ...formData });
      
      setFormData(initialForm);
      fetchHistory(); // Refresh table dataset
    } catch (err) {
      alert("Error processing record: " + (err.response?.data?.message || err.message));
    }
  };

  const inputClass = "w-full border border-pink-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-pink-500 text-gray-800 shadow-sm";
  const labelClass = "block text-xs font-bold text-pink-950 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-5xl space-y-8 p-2">
      {/* ADD RECORD FORM */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl border shadow-sm space-y-6 bg-pink-50/70 border-pink-100">
        <div className="border-b border-pink-200 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-pink-900">
              Log Past Obstetric Outcome
            </h2>
            <p className="text-sm text-pink-700 mt-0.5">Maintain granular records for previous gestations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-pink-100">
          <div>
            <label className={labelClass}>Pregnancy No. (G)</label>
            <input required type="number" name="pregnancy_number" value={formData.pregnancy_number} onChange={handleChange} placeholder="e.g., 1" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Year of Birth</label>
            <input required type="number" name="year_of_birth" value={formData.year_of_birth} onChange={handleChange} placeholder="e.g., 2021" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pregnancy Outcome</label>
            <select name="outcome" value={formData.outcome} onChange={handleChange} className={inputClass}>
              <option value="Live Birth">Live Birth</option>
              <option value="Stillbirth">Stillbirth</option>
              <option value="Miscarriage">Miscarriage</option>
              <option value="Abortion">Abortion</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Neonatal Sex</label>
            <select name="sex" value={formData.sex} onChange={handleChange} className={inputClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-pink-100">
          <div>
            <label className={labelClass}>Birth Weight (kg)</label>
            <input type="number" step="0.1" name="birth_weight" value={formData.birth_weight} onChange={handleChange} placeholder="e.g., 3.2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mode of Delivery</label>
            <select name="mode_of_delivery" value={formData.mode_of_delivery} onChange={handleChange} className={inputClass}>
              <option value="Normal">Normal Delivery</option>
              <option value="C-Section">C-Section</option>
              <option value="Vacuum">Vacuum</option>
              <option value="Forceps">Forceps</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Observed Complications</label>
            <input type="text" name="complications" value={formData.complications} onChange={handleChange} placeholder="None" className={inputClass} />
          </div>
        </div>

        <Button type="submit" className="w-full py-3 text-sm font-semibold tracking-wide">
          Save
        </Button>
      </form>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm">
        <div className="p-4 bg-pink-100 text-pink-950 font-bold text-base">Historical Gestational Ledger</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-pink-50/50 text-pink-900 border-b border-pink-100 font-bold">
                <th className="p-3.5">Preg. No.</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5">Sex</th>
                <th className="p-3.5">Weight</th>
                <th className="p-3.5">Delivery Mode</th>
                <th className="p-3.5">Complications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 italic">
                    No past obstetric history recorded yet.
                  </td>
                </tr>
              ) : (
                history.map((h, i) => (
                  <tr key={h.history_id || h.id || i} className="hover:bg-pink-50/20 transition-colors">
                    <td className="p-3.5 font-bold text-pink-700">G{h.pregnancy_number}</td>
                    <td className="p-3.5">{h.year_of_birth}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        h.outcome === 'Live Birth' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {h.outcome}
                      </span>
                    </td>
                    <td className="p-3.5">{h.sex}</td>
                    <td className="p-3.5">{h.birth_weight ? `${h.birth_weight} kg` : '-'}</td>
                    <td className="p-3.5">{h.mode_of_delivery}</td>
                    <td className="p-3.5 max-w-[200px] truncate" title={h.complications}>{h.complications || 'None'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}