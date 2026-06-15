import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function RoutineLabs() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    syphilis_poa: '', syphilis_sample_date: '', syphilis_result_date: '', syphilis_result: '', syphilis_referral_date: '',
    bs_1_poa: '', bs_1_result: '', bs_2_poa: '', bs_2_result: '',
    hb_1_poa: '', hb_1_result: '', hb_2_poa: '', hb_2_result: '',
    hiv_sample_date: '', hiv_result_date: '',
    malaria_poa: '', malaria_result: '', other_investigations: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/labs/${id}`).then(res => {
      if (res.data) {
        const formatData = { ...res.data };
        // Clean up dates for HTML inputs
        ['syphilis_sample_date', 'syphilis_result_date', 'syphilis_referral_date', 'hiv_sample_date', 'hiv_result_date'].forEach(field => {
          if (formatData[field]) formatData[field] = formatData[field].split('T')[0];
        });
        setFormData(formatData);
      }
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/labs', { patient_id: id, ...formData });
    alert('Lab records updated successfully!');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = "w-full border-2 border-pink-100 p-3 rounded-2xl focus:border-pink-500 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-semibold text-pink-900 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      
      {/* SYPHILIS SCREENING */}
      <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
        <h3 className="text-xl font-bold text-pink-800 mb-4 border-b border-pink-200 pb-2">Syphilis Screening</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>POA at sampling</label>
            <input type="text" name="syphilis_poa" value={formData.syphilis_poa} onChange={handleChange} className={inputClass} placeholder="e.g. 12 weeks" />
          </div>
          <div>
            <label className={labelClass}>Date of sampling</label>
            <input type="date" name="syphilis_sample_date" value={formData.syphilis_sample_date} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date result received</label>
            <input type="date" name="syphilis_result_date" value={formData.syphilis_result_date} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Result (NR / R)</label>
            <select name="syphilis_result" value={formData.syphilis_result} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="NR">NR (Non-Reactive)</option>
              <option value="R">R (Reactive)</option>
            </select>
          </div>
          
          {/* Conditional Referral Date */}
          {formData.syphilis_result === 'R' && (
            <div className="col-span-2 md:col-span-4 bg-red-50 p-4 rounded-xl border border-red-200 mt-2">
              <label className="block text-sm font-bold text-red-800 mb-1">If (R) Date of Referral</label>
              <input type="date" name="syphilis_referral_date" value={formData.syphilis_referral_date} onChange={handleChange} className={`${inputClass} border-red-300`} />
            </div>
          )}
        </div>
      </div>

      {/* HAEMOGLOBIN & BLOOD SUGAR */}
      <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
  <h3 className="text-xl font-bold text-pink-800 mb-6 border-b border-pink-200 pb-2">Investigations</h3>
  
  {/* Header labels to provide context when inputs are filled */}
  <div className="grid grid-cols-3 gap-4 mb-2 px-1">
    <div></div> {/* Spacer for the title column */}
    <label className={labelClass}>POA (Weeks)</label>
    <label className={labelClass}>Result</label>
  </div>

  <div className="space-y-4">
    {/* Blood Sugar Row 1 */}
    <div className="grid grid-cols-3 gap-4 items-center">
      <span className="font-bold text-pink-900 text-sm">Blood Sugar 1</span>
      <input type="text" name="bs_1_poa" value={formData.bs_1_poa} onChange={handleChange} className={inputClass} placeholder="POA" />
      <input type="text" name="bs_1_result" value={formData.bs_1_result} onChange={handleChange} className={inputClass} placeholder="Result" />
    </div>

    {/* Blood Sugar Row 2 */}
    <div className="grid grid-cols-3 gap-4 items-center">
      <span className="font-bold text-pink-900 text-sm">Blood Sugar 2</span>
      <input type="text" name="bs_2_poa" value={formData.bs_2_poa} onChange={handleChange} className={inputClass} placeholder="POA" />
      <input type="text" name="bs_2_result" value={formData.bs_2_result} onChange={handleChange} className={inputClass} placeholder="Result" />
    </div>

    <div className="h-px bg-pink-200 my-4"></div>

    {/* Haemoglobin Row 1 */}
    <div className="grid grid-cols-3 gap-4 items-center">
      <span className="font-bold text-pink-900 text-sm">Haemoglobin 1</span>
      <input type="text" name="hb_1_poa" value={formData.hb_1_poa} onChange={handleChange} className={inputClass} placeholder="POA" />
      <input type="text" name="hb_1_result" value={formData.hb_1_result} onChange={handleChange} className={inputClass} placeholder="Result" />
    </div>

    {/* Haemoglobin Row 2 */}
    <div className="grid grid-cols-3 gap-4 items-center">
      <span className="font-bold text-pink-900 text-sm">Haemoglobin 2</span>
      <input type="text" name="hb_2_poa" value={formData.hb_2_poa} onChange={handleChange} className={inputClass} placeholder="POA" />
      <input type="text" name="hb_2_result" value={formData.hb_2_result} onChange={handleChange} className={inputClass} placeholder="Result" />
    </div>
  </div>
</div>

      {/* HIV & MALARIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
          <h3 className="text-xl font-bold text-pink-800 mb-4 border-b border-pink-200 pb-2">HIV Screening</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Date of blood sample</label>
              <input type="date" name="hiv_sample_date" value={formData.hiv_sample_date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date result informed</label>
              <input type="date" name="hiv_result_date" value={formData.hiv_result_date} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
          <h3 className="text-xl font-bold text-pink-800 mb-4 border-b border-pink-200 pb-2">Blood Film (Malaria)</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>POA</label>
              <input type="text" name="malaria_poa" value={formData.malaria_poa} onChange={handleChange} className={inputClass} placeholder="POA" />
            </div>
            <div>
              <label className={labelClass}>Result</label>
              <input type="text" name="malaria_result" value={formData.malaria_result} onChange={handleChange} className={inputClass} placeholder="Result" />
            </div>
          </div>
        </div>
      </div>

      {/* OTHER INVESTIGATIONS */}
      <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
        <h3 className="text-xl font-bold text-pink-800 mb-4 border-b border-pink-200 pb-2">Other Investigations</h3>
        <textarea 
          name="other_investigations" 
          value={formData.other_investigations} 
          onChange={handleChange} 
          className={`${inputClass} min-h-[120px]`} 
          placeholder="Enter any additional investigations..." 
        />
      </div>

      <div className="pb-8">
        <Button type="submit" className="w-full text-lg">Save Lab Investigations</Button>
      </div>
    </form>
  );
}