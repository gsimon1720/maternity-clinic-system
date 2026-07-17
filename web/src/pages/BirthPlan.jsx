import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function BirthPlan() {
  const { id } = useParams();
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    plan_date: new Date().toISOString().split('T')[0],
    intended_delivery_facility: '', 
    emergency_transport_mode: '',
    birth_companion_name: '', 
    support_phone: '',
    blood_donor_name: '', 
    blood_donor_phone: '', 
    emergency_funds_arranged: 'Yes'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/birth-plan/${id}`);
      // Safeguard: Guarantees 'plans' is always an array so .map() never crashes
      const dataArray = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      setPlans(dataArray);
    } catch (err) {
      console.error("Error loading delivery blueprints:", err);
    }
  };

  useEffect(() => { fetchPlans(); }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const startEditing = (p) => {
    const confirmIntent = window.confirm("⚠️ DELIVERY INFRASTRUCTURE PLANNING ALTERATION:\n\nYou are updating vital emergency transport and backup parameters. Continue?");
    if (!confirmIntent) return;
    setEditingId(p.id || p._id);
    setFormData({ 
      ...p, 
      plan_date: p.plan_date ? new Date(p.plan_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0] 
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const confirmOverwrite = window.confirm("🔴 WARN: Permanently replace emergency delivery logistics values?");
        if (!confirmOverwrite) return;
        await axios.put(`http://localhost:5000/api/birth-plan/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/birth-plan', { patient_id: id, ...formData });
      }
      setFormData(initialForm);
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      alert('Error updating birth blueprint: ' + err.message);
    }
  };

  const inputClass = "w-full border border-pink-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-pink-500 text-gray-800 shadow-sm";
  const labelClass = "block text-xs font-bold text-pink-950 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-5xl space-y-8 p-2">
      <form onSubmit={handleSubmit} className={`p-6 rounded-3xl border shadow-sm space-y-6 ${editingId ? 'bg-amber-50/60 border-amber-200' : 'bg-pink-50/70 border-pink-100'}`}>
        <div className="border-b border-pink-200 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-pink-900">{editingId ? '⚠️ Edit Authorized Birth Strategy' : 'Birth Preparedness & Delivery Plan'}</h2>
            <p className="text-sm text-pink-700 mt-0.5">Configure emergency transport grids, logistics, and donor networks.</p>
          </div>
          {editingId && <button type="button" onClick={cancelEditing} className="px-4 py-2 text-xs font-bold bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300">Discard Edits</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-pink-100">
          <div><label className={labelClass}>Planning Date</label><input required type="date" name="plan_date" value={formData.plan_date} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Intended Delivery Facility</label><input type="text" name="intended_delivery_facility" value={formData.intended_delivery_facility} onChange={handleChange} className={inputClass} placeholder="e.g. Base Hospital Ward" /></div>
          <div><label className={labelClass}>Emergency Transport Method</label><input type="text" name="emergency_transport_mode" value={formData.emergency_transport_mode} onChange={handleChange} className={inputClass} placeholder="e.g. Clinic Ambulance / Private Tri-Shaw" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-pink-100">
          <div><label className={labelClass}>Birth Companion Nominee</label><input type="text" name="birth_companion_name" value={formData.birth_companion_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Companion Phone Link</label><input type="text" name="support_phone" value={formData.support_phone} onChange={handleChange} className={inputClass} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-pink-100">
          <div><label className={labelClass}>Designated Blood Donor</label><input type="text" name="blood_donor_name" value={formData.blood_donor_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Donor Phone Link</label><input type="text" name="blood_donor_phone" value={formData.blood_donor_phone} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Emergency Funds Liquidated?</label><select name="emergency_funds_arranged" value={formData.emergency_funds_arranged} onChange={handleChange} className={inputClass}><option value="Yes">Yes, Secured</option><option value="No">No Arrangements</option></select></div>
        </div>

        <Button type="submit" className={`w-full py-3 text-sm font-semibold tracking-wide ${editingId ? 'bg-amber-600 hover:bg-amber-700' : ''}`}>
          {editingId ? 'Overwrite Birth Logistics Layout' : 'Commit Delivery Blueprint'}
        </Button>
      </form>

      <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm">
        <div className="p-4 bg-pink-100 text-pink-950 font-bold text-base">Historical Preparedness Grid</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-pink-50/50 text-pink-900 border-b border-pink-100 font-bold">
                <th className="p-3.5 bg-gray-50 border-r text-gray-800">Infrastructure Elements</th>
                {plans.map((p, i) => (
                  <th key={p.id || p._id || i} className="p-3.5 border-r text-center bg-pink-50/70 min-w-[140px]">
                    <span className="font-bold text-pink-950">{new Date(p.plan_date).toLocaleDateString()}</span>
                    <button type="button" onClick={() => startEditing(p)} className="mt-1.5 text-xs text-pink-600 font-semibold underline block mx-auto hover:text-pink-900">✏️ Change Plan</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3.5 font-semibold text-gray-700 bg-gray-50/30 border-r">Target Facility</td>{plans.map((p, i) => <td key={i} className="p-3.5 text-center border-r text-gray-800">{p.intended_delivery_facility || '-'}</td>)}</tr>
              <tr><td className="p-3.5 font-semibold text-gray-700 bg-gray-50/30 border-r">Transport Framework</td>{plans.map((p, i) => <td key={i} className="p-3.5 text-center border-r text-gray-800">{p.emergency_transport_mode || '-'}</td>)}</tr>
              <tr><td className="p-3.5 font-semibold text-gray-700 bg-gray-50/30 border-r">Companion / Link</td>{plans.map((p, i) => <td key={i} className="p-3.5 text-center border-r text-gray-800">{p.birth_companion_name || '-'} ({p.support_phone || '-'})</td>)}</tr>
              <tr><td className="p-3.5 font-semibold text-gray-700 bg-gray-50/30 border-r">Donor Reserve Grid</td>{plans.map((p, i) => <td key={i} className="p-3.5 text-center border-r text-gray-800">{p.blood_donor_name || '-'} ({p.blood_donor_phone || '-'})</td>)}</tr>
            </tbody>
          </table>
          {plans.length === 0 && <div className="p-8 text-center text-gray-400 italic">No birth strategies recorded yet.</div>}
        </div>
      </div>
    </div>
  );
}