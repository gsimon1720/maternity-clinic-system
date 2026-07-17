import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function MedicalHistory() {
  const { id } = useParams();
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialForm = {
    diabetes: 'No',
    hypertension: 'No',
    cardiac_diseases: 'No',
    bronchial_asthma: 'No',
    other_conditions: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // HELPER: Translates Postgres booleans (true/false) to React select strings ("Yes"/"No")
  const mapDataToForm = (data) => ({
    diabetes: data.diabetes ? 'Yes' : 'No',
    hypertension: data.hypertension ? 'Yes' : 'No',
    cardiac_diseases: data.cardiac_diseases ? 'Yes' : 'No',
    bronchial_asthma: data.bronchial_asthma ? 'Yes' : 'No',
    other_conditions: data.other_conditions || ''
  });

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/medical-history/${id}?t=${Date.now()}`);
      if (res.data) {
        setFormData(mapDataToForm(res.data));
        setHasExistingRecord(true);
      }
    } catch (err) {
      console.error("Error fetching patient medical history:", err);
    } finally {
      loading && setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety guard to completely block accidental frontend submissions
    if (hasExistingRecord) {
      alert("This record is locked and cannot be modified.");
      return;
    }
    
    try {
      const payload = { 
        patient_id: parseInt(id, 10), 
        ...formData 
      };

      const res = await axios.post('http://localhost:5000/api/medical-history', payload);
      
      alert('Medical history saved successfully!');
      
      if (res.data) {
        setFormData(mapDataToForm(res.data));
        setHasExistingRecord(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      alert('Error saving medical history: ' + errorMessage);
    }
  };

  const inputClass = "w-full border border-pink-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-pink-500 text-gray-800 shadow-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed";
  const labelClass = "block text-xs font-bold text-pink-950 mb-1 uppercase tracking-wider disabled:text-gray-400";

  if (loading) {
    return <div className="p-8 text-center text-gray-500 italic">Loading medical history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2">
      <form onSubmit={handleSubmit} className={`p-6 rounded-3xl border shadow-sm space-y-6 ${hasExistingRecord ? 'bg-slate-50 border-slate-200' : 'bg-pink-50/70 border-pink-100'}`}>
        <div className="border-b border-pink-200 pb-3 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-pink-900">
              {hasExistingRecord ? 'Permanent Medical & Surgical History' : 'New Medical & Surgical History'}
            </h2>
            <p className="text-sm text-pink-700 mt-0.5">
              {hasExistingRecord ? 'This medical data is locked and completely read-only.' : 'Log chronic maternal comorbidities and surgical history.'}
            </p>
          </div>
          {hasExistingRecord && (
            <span className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-slate-300">
              🔒 Read-Only
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-pink-100 disabled:border-gray-200">
          <div>
            <label className={labelClass}>Hypertension</label>
            <select name="hypertension" value={formData.hypertension} onChange={handleChange} disabled={hasExistingRecord} className={inputClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Diabetes Mellitus</label>
            <select name="diabetes" value={formData.diabetes} onChange={handleChange} disabled={hasExistingRecord} className={inputClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Cardiac Diseases</label>
            <select name="cardiac_diseases" value={formData.cardiac_diseases} onChange={handleChange} disabled={hasExistingRecord} className={inputClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Bronchial Asthma</label>
            <select name="bronch_asthma" value={formData.bronchial_asthma} onChange={handleChange} disabled={hasExistingRecord} className={inputClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-pink-100">
          <label className={labelClass}>Other Medical / Surgical Conditions</label>
          <textarea 
            name="other_conditions" 
            value={formData.other_conditions} 
            onChange={handleChange} 
            disabled={hasExistingRecord}
            placeholder={hasExistingRecord ? "No additional conditions recorded." : "Describe past surgeries, known allergies, or other medical findings..."} 
            className={`${inputClass} h-24 resize-none`}
          />
        </div>

        {!hasExistingRecord && (
          <Button type="submit" className="w-full py-3 text-sm font-semibold tracking-wide">
            Save
          </Button>
        )}
      </form>
    </div>
  );
}