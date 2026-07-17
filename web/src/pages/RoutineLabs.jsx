import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function RoutineLabs() {
  const { id } = useParams();

  const [isSavedOnce, setIsSavedOnce] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialForm = {
    syphilis_poa: '', syphilis_sample_date: '', syphilis_result_date: '', syphilis_result: '', syphilis_referral_date: '',
    bs_1_poa: '', bs_1_result: '', bs_2_poa: '', bs_2_result: '',
    hb_1_poa: '', hb_1_result: '', hb_2_poa: '', hb_2_result: '',
    hiv_sample_date: '', hiv_result_date: '',
    malaria_poa: '', malaria_result: '',
    other_investigations: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchLabs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/labs/${id}`);

      if (res.data) {
        setFormData(prev => ({
          ...prev,
          ...res.data
        }));
        setIsSavedOnce(true);
      }
    } catch (err) {
      console.error("Error fetching labs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/labs', {
        patient_id: id,
        ...formData
      });

      alert('Laboratory record saved successfully.');
      setIsSavedOnce(true);

    } catch (err) {
      alert('Error saving data: ' + err.message);
    }
  };

  const inputClass =
    "w-full border border-pink-200 bg-white p-3 rounded-xl text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all";

  const labelClass =
    "block text-xs font-bold text-pink-900 mb-1 uppercase";

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-pink-950">
              Routine Laboratory Investigations
            </h2>
            <p className="text-gray-500 mt-1">
              Maternal routine screening and laboratory assessment
            </p>
          </div>

          {isSavedOnce && (
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Record Saved
            </span>
          )}
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase">Syphilis</p>
            <p className="text-lg font-bold text-pink-900 mt-1">
              {formData.syphilis_result || "Pending"}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase">Blood Sugar</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {formData.bs_2_result || formData.bs_1_result || "Pending"}
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase">Hemoglobin</p>
            <p className="text-lg font-bold text-red-900 mt-1">
              {formData.hb_2_result || formData.hb_1_result || "Pending"}
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase">Malaria</p>
            <p className="text-lg font-bold text-green-900 mt-1">
              {formData.malaria_result || "Pending"}
            </p>
          </div>
        </div>

        {/* SYPHILIS */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6">
          <h3 className="text-xl font-bold mb-4">🧪 Syphilis Screening</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label className={labelClass}>POA (Weeks)</label>
              <input
                name="syphilis_poa"
                value={formData.syphilis_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 12 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Result</label>
              <select
                name="syphilis_result"
                value={formData.syphilis_result}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Result</option>
                <option value="NR">Non-Reactive (NR)</option>
                <option value="R">Reactive (R)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Sample Date</label>
              <input
                type="date"
                name="syphilis_sample_date"
                value={formData.syphilis_sample_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Result Date</label>
              <input
                type="date"
                name="syphilis_result_date"
                value={formData.syphilis_result_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Referral Date</label>
              <input
                type="date"
                name="syphilis_referral_date"
                value={formData.syphilis_referral_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* BLOOD SUGAR */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6">
          <h3 className="text-xl font-bold mb-4">🩸 Blood Sugar Monitoring</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>Test 1 POA</label>
              <input
                name="bs_1_poa"
                value={formData.bs_1_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 10 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Test 1 Result (mg/dL)</label>
              <input
                name="bs_1_result"
                value={formData.bs_1_result}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 92"
              />
            </div>

            <div>
              <label className={labelClass}>Test 2 POA</label>
              <input
                name="bs_2_poa"
                value={formData.bs_2_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 24 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Test 2 Result (mg/dL)</label>
              <input
                name="bs_2_result"
                value={formData.bs_2_result}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 110"
              />
            </div>

          </div>
        </div>

        {/* HEMOGLOBIN */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6">
          <h3 className="text-xl font-bold mb-4">🩸 Hemoglobin Monitoring</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>Hb Test 1 POA</label>
              <input
                name="hb_1_poa"
                value={formData.hb_1_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 12 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Hb Test 1 (g/dL)</label>
              <input
                name="hb_1_result"
                value={formData.hb_1_result}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 11.2"
              />
            </div>

            <div>
              <label className={labelClass}>Hb Test 2 POA</label>
              <input
                name="hb_2_poa"
                value={formData.hb_2_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 28 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Hb Test 2 (g/dL)</label>
              <input
                name="hb_2_result"
                value={formData.hb_2_result}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 10.5"
              />
            </div>

          </div>
        </div>

        {/* HIV / MALARIA */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6">
          <h3 className="text-xl font-bold mb-4">🦠 HIV & Malaria Screening</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>HIV Sample Date</label>
              <input
                type="date"
                name="hiv_sample_date"
                value={formData.hiv_sample_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>HIV Result Date</label>
              <input
                type="date"
                name="hiv_result_date"
                value={formData.hiv_result_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Malaria POA</label>
              <input
                name="malaria_poa"
                value={formData.malaria_poa}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 16 weeks"
              />
            </div>

            <div>
              <label className={labelClass}>Malaria Result</label>
              <select
                name="malaria_result"
                value={formData.malaria_result}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Negative">Negative</option>
                <option value="Positive">Positive</option>
              </select>
            </div>

          </div>
        </div>

        {/* OTHER */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6">
          <h3 className="text-xl font-bold mb-4">📝 Other Investigations</h3>

          <textarea
            name="other_investigations"
            value={formData.other_investigations}
            onChange={handleChange}
            className={`${inputClass} h-28`}
            placeholder="Enter additional notes, lab comments, or special investigations..."
          />
        </div>

        {/* SAVE */}
        <Button type="submit" className="w-full py-4 text-lg">
          Save
        </Button>

      </form>
    </div>
  );
}