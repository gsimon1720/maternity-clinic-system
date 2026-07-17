import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const Diagnosis = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    hypertension: false,
    multiplePregnancy: false,
    vaginalBleeding: false,
    gestationalDiabetes: false,
    anemia: false,
    otherConditions: '',
    riskLevel: 'Low Risk',
    doctorComments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDiagnoses([...diagnoses, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      hypertension: false,
      multiplePregnancy: false,
      vaginalBleeding: false,
      gestationalDiabetes: false,
      anemia: false,
      otherConditions: '',
      riskLevel: 'Low Risk',
      doctorComments: ''
    });
  };

  const riskColors = {
    'Low Risk': 'bg-success/10 text-success',
    'Medium Risk': 'bg-warning/10 text-warning',
    'High Risk': 'bg-danger/10 text-danger'
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Diagnosis</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record patient diagnosis and risk assessment</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
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
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Conditions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'hypertension', label: 'Hypertension' },
                    { key: 'multiplePregnancy', label: 'Multiple Pregnancy' },
                    { key: 'vaginalBleeding', label: 'Vaginal Bleeding' },
                    { key: 'gestationalDiabetes', label: 'Gestational Diabetes' },
                    { key: 'anemia', label: 'Anemia' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Conditions
                </label>
                <input
                  type="text"
                  value={formData.otherConditions}
                  onChange={(e) => setFormData({ ...formData, otherConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Specify any other conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Level
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                >
                  <option value="Low Risk">Low Risk</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctor Comments
                </label>
                <textarea
                  value={formData.doctorComments}
                  onChange={(e) => setFormData({ ...formData, doctorComments: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Add your clinical comments here..."
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Diagnosis
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Diagnoses</h3>
            {diagnoses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No diagnoses recorded yet</p>
            ) : (
              <div className="space-y-3">
                {diagnoses.slice().reverse().map((d, index) => {
                  const patient = patients.find(p => p.id === parseInt(d.patientId));
                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {patient?.firstName} {patient?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{d.date}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${riskColors[d.riskLevel]}`}>
                        {d.riskLevel}
                      </span>
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

export default Diagnosis;