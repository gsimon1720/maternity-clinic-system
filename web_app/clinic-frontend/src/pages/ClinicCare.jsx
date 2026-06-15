import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function ClinicCare() {
  const { id } = useParams();
  const [visits, setVisits] = useState([]);
  
  const initialFormState = {
    visit_date: new Date().toISOString().split('T')[0], poa: '', weight: '', 
    urine_sugar: '', urine_albumin: '', pallor: '', oedema_ankle: '', oedema_facial: '', 
    bp_systolic: '', bp_diastolic: '', fundal_height: '', foetal_lie: '', presentation: '', 
    engagement: '', fm: '', fhs: '', iron: '', folate: '', calcium: '', vitamin_c: '', 
    food_supplementation: '', officer_signature: '', designation: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchVisits = async () => {
    const res = await axios.get(`http://localhost:5000/api/clinic-care/${id}`);
    setVisits(res.data);
  };

  useEffect(() => { fetchVisits(); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/clinic-care', { patient_id: id, ...formData });
    fetchVisits(); 
    setFormData(initialFormState); 
    alert('Clinic visit logged successfully!');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = "w-full border-2 border-pink-100 p-2.5 rounded-xl focus:border-pink-500 outline-none transition-all bg-white text-sm";
  const labelClass = "block text-xs font-bold text-pink-900 mb-1 uppercase tracking-wide";

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="bg-pink-50 p-6 rounded-3xl border border-pink-100 shadow-sm">
        <h2 className="text-2xl font-bold text-pink-900 mb-6 border-b-2 border-pink-200 pb-2">Log New Clinic Visit</h2>
        
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div><label className={labelClass}>Date of Visit</label><input required type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>POA</label><input type="text" name="poa" value={formData.poa} onChange={handleChange} className={inputClass} placeholder="Weeks" /></div>
          <div><label className={labelClass}>Officer Signature</label><input type="text" name="officer_signature" value={formData.officer_signature} onChange={handleChange} className={inputClass} placeholder="Name/Initials" /></div>
          <div><label className={labelClass}>Designation</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} className={inputClass} placeholder="e.g. Midwife" /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          
          {/* Maternal Examination */}
          <div className="bg-white p-5 rounded-2xl border border-pink-100">
            <h3 className="font-bold text-pink-800 mb-4 border-b border-pink-50 pb-2">Maternal Examination</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Weight (kg)</label><input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Blood Pressure</label>
                <div className="flex gap-2">
                  <input type="number" name="bp_systolic" value={formData.bp_systolic} onChange={handleChange} className={inputClass} placeholder="Sys" />
                  <input type="number" name="bp_diastolic" value={formData.bp_diastolic} onChange={handleChange} className={inputClass} placeholder="Dia" />
                </div>
              </div>
              <div><label className={labelClass}>Pallor</label><input type="text" name="pallor" value={formData.pallor} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Urine Sugar</label><input type="text" name="urine_sugar" value={formData.urine_sugar} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Urine Albumin</label><input type="text" name="urine_albumin" value={formData.urine_albumin} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Oedema (Ankle)</label><input type="text" name="oedema_ankle" value={formData.oedema_ankle} onChange={handleChange} className={inputClass} /></div>
              <div className="col-span-2"><label className={labelClass}>Oedema (Facial)</label><input type="text" name="oedema_facial" value={formData.oedema_facial} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>

          {/* Obstetric Examination */}
          <div className="bg-white p-5 rounded-2xl border border-pink-100">
            <h3 className="font-bold text-pink-800 mb-4 border-b border-pink-50 pb-2">Obstetric Examination</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Fundal Height</label><input type="text" name="fundal_height" value={formData.fundal_height} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Foetal Lie</label><input type="text" name="foetal_lie" value={formData.foetal_lie} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Presentation</label><input type="text" name="presentation" value={formData.presentation} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Engagement</label><input type="text" name="engagement" value={formData.engagement} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>FM (Movements)</label><input type="text" name="fm" value={formData.fm} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>FHS (Heart Sound)</label><input type="text" name="fhs" value={formData.fhs} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
        </div>

        {/* Supplements Issued */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 mb-6">
          <h3 className="font-bold text-pink-800 mb-4 border-b border-pink-50 pb-2">Supplements Issued at Visit</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><label className={labelClass}>Iron</label><input type="text" name="iron" value={formData.iron} onChange={handleChange} className={inputClass} placeholder="Qty/Yes" /></div>
            <div><label className={labelClass}>Folate</label><input type="text" name="folate" value={formData.folate} onChange={handleChange} className={inputClass} placeholder="Qty/Yes" /></div>
            <div><label className={labelClass}>Calcium</label><input type="text" name="calcium" value={formData.calcium} onChange={handleChange} className={inputClass} placeholder="Qty/Yes" /></div>
            <div><label className={labelClass}>Vitamin C</label><input type="text" name="vitamin_c" value={formData.vitamin_c} onChange={handleChange} className={inputClass} placeholder="Qty/Yes" /></div>
            <div><label className={labelClass}>Food Supp.</label><input type="text" name="food_supplementation" value={formData.food_supplementation} onChange={handleChange} className={inputClass} placeholder="Details" /></div>
          </div>
        </div>

        <Button type="submit" className="w-full text-lg">Save Visit Record</Button>
      </form>

      {/* HISTORY TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="p-6 border-b border-pink-100 bg-pink-50">
          <h3 className="text-xl font-bold text-pink-900">Clinic Care History</h3>
        </div>
        
        {/* Overflow-x-auto allows horizontal scrolling for the wide table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-pink-100 text-pink-900">
                <th className="p-4 font-semibold border-b border-pink-200">Date</th>
                <th className="p-4 font-semibold border-b border-pink-200">POA</th>
                <th className="p-4 font-semibold border-b border-pink-200">Weight</th>
                <th className="p-4 font-semibold border-b border-pink-200">BP</th>
                <th className="p-4 font-semibold border-b border-pink-200">Urine (Sug/Alb)</th>
                <th className="p-4 font-semibold border-b border-pink-200">Fundal Ht.</th>
                <th className="p-4 font-semibold border-b border-pink-200">Lie/Pres.</th>
                <th className="p-4 font-semibold border-b border-pink-200">FM/FHS</th>
                <th className="p-4 font-semibold border-b border-pink-200">Officer</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(v => (
                <tr key={v.care_id} className="border-b border-gray-50 hover:bg-pink-50 transition-colors">
                  <td className="p-4">{new Date(v.visit_date).toLocaleDateString()}</td>
                  <td className="p-4">{v.poa}</td>
                  <td className="p-4">{v.weight} kg</td>
                  <td className="p-4">{v.bp_systolic}/{v.bp_diastolic}</td>
                  <td className="p-4">{v.urine_sugar} / {v.urine_albumin}</td>
                  <td className="p-4">{v.fundal_height}</td>
                  <td className="p-4">{v.foetal_lie} / {v.presentation}</td>
                  <td className="p-4">{v.fm} / {v.fhs}</td>
                  <td className="p-4">{v.officer_signature}</td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr><td colSpan="9" className="p-8 text-center text-gray-400 italic">No clinic visits recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}