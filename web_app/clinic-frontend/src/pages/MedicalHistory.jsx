import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function MedicalHistory() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    diabetes: false, hypertension: false, cardiac_diseases: false, bronchial_asthma: false, other_conditions: ''
  });

  useEffect(() => {
    // Fetch data. If exists, populate form. If null, form remains default (empty).
    axios.get(`http://localhost:5000/api/medical-history/${id}`).then(res => {
      if (res.data) setFormData(res.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/medical-history', { patient_id: id, ...formData });
    alert('Medical History Saved Successfully!');
  };

  const handleCheckbox = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Medical & Surgical History</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <label className="flex items-center gap-2"><input type="checkbox" name="diabetes" checked={formData.diabetes} onChange={handleCheckbox}/> Diabetes</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="hypertension" checked={formData.hypertension} onChange={handleCheckbox}/> Hypertension</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="cardiac_diseases" checked={formData.cardiac_diseases} onChange={handleCheckbox}/> Cardiac Diseases</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="bronchial_asthma" checked={formData.bronchial_asthma} onChange={handleCheckbox}/> Bronchial Asthma</label>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Other Conditions</label>
        <textarea className="w-full border p-2 rounded" rows="3" value={formData.other_conditions || ''} onChange={e => setFormData({...formData, other_conditions: e.target.value})}></textarea>
      </div>

      <Button type="submit">
        Save Medical History
    </Button>
    </form>
  );
}