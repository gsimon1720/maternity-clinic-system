import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Activity, Thermometer, Heart, Scale } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const VitalSigns = () => {
  const [vitals, setVitals] = useState(
    patients.flatMap(p => 
      p.vitalSigns.map(v => ({
        ...v,
        patientName: `${p.firstName} ${p.lastName}`,
        patientId: p.id
      }))
    )
  );
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    pulse: '',
    respiratoryRate: '',
    bloodPressure: '',
    weight: '',
    height: '',
    bmi: ''
  });

  const calculateBMI = (weight, height) => {
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newForm = { ...prev, [name]: value };
      if (name === 'weight' || name === 'height') {
        newForm.bmi = calculateBMI(newForm.weight, newForm.height);
      }
      return newForm;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVitals([...vitals, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      temperature: '',
      pulse: '',
      respiratoryRate: '',
      bloodPressure: '',
      weight: '',
      height: '',
      bmi: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vital Signs</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record patient vital signs</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient
                </label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Thermometer className="w-4 h-4 inline mr-1" />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Pulse Rate (bpm)
                  </label>
                  <input
                    type="number"
                    name="pulse"
                    value={formData.pulse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Respiratory Rate (/min)
                  </label>
                  <input
                    type="number"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="e.g., 120/80"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Scale className="w-4 h-4 inline mr-1" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    BMI
                  </label>
                  <input
                    type="text"
                    name="bmi"
                    value={formData.bmi}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    disabled
                  />
                </div>
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Record Vital Signs
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Vital Signs</h3>
            {vitals.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No vital signs recorded yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {vitals.slice().reverse().map((v, index) => {
                  const patient = patients.find(p => p.id === parseInt(v.patientId));
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{v.date}</p>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400">BP: {v.bloodPressure}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Pulse: {v.pulse} bpm</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Temp: {v.temperature}°C</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">BMI: {v.bmi}</p>
                          </div>
                        </div>
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VitalSigns;