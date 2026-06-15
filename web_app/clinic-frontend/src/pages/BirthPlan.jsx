import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

export default function BirthPlan() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    delivery_hospital: '', delivery_transport: '', delivery_cost: '', delivery_distance: '', delivery_time: '',
    emergency_hospital: '', emergency_transport: '', emergency_cost: '', emergency_distance: '', emergency_time: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/birth-plan/${id}`).then(res => {
      if (res.data) setFormData(res.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/birth-plan', { patient_id: id, ...formData });
    alert('Birth & emergency preparedness plan saved successfully!');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Styles for our two columns
  const pinkInput = "w-full border-2 border-pink-100 p-3 rounded-2xl focus:border-pink-500 outline-none transition-all bg-white placeholder-pink-200";
  const redInput = "w-full border-2 border-red-100 p-3 rounded-2xl focus:border-red-400 outline-none transition-all bg-white placeholder-red-200";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        
        <h2 className="text-2xl font-bold text-pink-900 mb-8 border-b-2 border-pink-100 pb-4">
          Birth and emergency preparedness plan
        </h2>

        {/* TABLE HEADERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
          <div className="hidden md:block"></div> {/* Empty space for the row labels */}
          <div className="bg-pink-100 p-4 rounded-2xl text-center shadow-sm">
            <h3 className="text-xl font-bold text-pink-900 uppercase tracking-wide">For delivery</h3>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl text-center shadow-sm border border-red-100">
            <h3 className="text-xl font-bold text-red-900 uppercase tracking-wide">In an emergency</h3>
          </div>
        </div>

        {/* ROWS */}
        <div className="space-y-6">
          
          {/* Intended hospital */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-4">
            <label className="font-bold text-gray-700 md:text-right pr-4 text-lg">Intended hospital</label>
            <input type="text" name="delivery_hospital" value={formData.delivery_hospital} onChange={handleChange} className={pinkInput} />
            <input type="text" name="emergency_hospital" value={formData.emergency_hospital} onChange={handleChange} className={redInput} />
          </div>

          {/* Mode of transport */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-4">
            <label className="font-bold text-gray-700 md:text-right pr-4 text-lg">Mode of transport</label>
            <input type="text" name="delivery_transport" value={formData.delivery_transport} onChange={handleChange} className={pinkInput} />
            <input type="text" name="emergency_transport" value={formData.emergency_transport} onChange={handleChange} className={redInput} />
          </div>

          {/* Average cost */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-4">
            <label className="font-bold text-gray-700 md:text-right pr-4 text-lg">Average cost</label>
            <input type="text" name="delivery_cost" value={formData.delivery_cost} onChange={handleChange} className={pinkInput} placeholder="Rs." />
            <input type="text" name="emergency_cost" value={formData.emergency_cost} onChange={handleChange} className={redInput} placeholder="Rs." />
          </div>

          {/* Distance from home */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-4">
            <label className="font-bold text-gray-700 md:text-right pr-4 text-lg">Distance from home</label>
            <input type="text" name="delivery_distance" value={formData.delivery_distance} onChange={handleChange} className={pinkInput} placeholder="km" />
            <input type="text" name="emergency_distance" value={formData.emergency_distance} onChange={handleChange} className={redInput} placeholder="km" />
          </div>

          {/* Time taken to reach */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-2">
            <label className="font-bold text-gray-700 md:text-right pr-4 text-lg">Time taken to reach</label>
            <input type="text" name="delivery_time" value={formData.delivery_time} onChange={handleChange} className={pinkInput} placeholder="mins/hours" />
            <input type="text" name="emergency_time" value={formData.emergency_time} onChange={handleChange} className={redInput} placeholder="mins/hours" />
          </div>

        </div>

      </div>

      <div className="pb-8">
        <Button type="submit" className="w-full text-lg">Save Preparedness Plan</Button>
      </div>
    </form>
  );
}