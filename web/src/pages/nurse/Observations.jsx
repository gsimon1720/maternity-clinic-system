import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, MessageSquare, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const Observations = () => {
  const [observations, setObservations] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    generalCondition: 'Good',
    symptoms: '',
    complaints: '',
    observationNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setObservations([...observations, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      generalCondition: 'Good',
      symptoms: '',
      complaints: '',
      observationNotes: ''
    });
  };

  const conditionColors = {
    'Good': 'bg-success/10 text-success',
    'Stable': 'bg-primary/10 text-primary',
    'Fair': 'bg-warning/10 text-warning',
    'Poor': 'bg-danger/10 text-danger',
    'Critical': 'bg-danger/20 text-danger font-bold'
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Observations</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record patient observations</p>

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  General Condition
                </label>
                <select
                  value={formData.generalCondition}
                  onChange={(e) => setFormData({ ...formData, generalCondition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                >
                  <option value="Good">Good</option>
                  <option value="Stable">Stable</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Symptoms
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Describe symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complaints
                </label>
                <textarea
                  value={formData.complaints}
                  onChange={(e) => setFormData({ ...formData, complaints: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Record patient complaints..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Observation Notes
                </label>
                <textarea
                  value={formData.observationNotes}
                  onChange={(e) => setFormData({ ...formData, observationNotes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Detailed observation notes..."
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Observation
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Observations</h3>
            {observations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No observations recorded yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {observations.slice().reverse().map((o, index) => {
                  const patient = patients.find(p => p.id === parseInt(o.patientId));
                  return (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{o.date}</p>
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${conditionColors[o.generalCondition]}`}>
                            {o.generalCondition}
                          </span>
                          {o.symptoms && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Symptoms: {o.symptoms.substring(0, 50)}...
                            </p>
                          )}
                        </div>
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

export default Observations;