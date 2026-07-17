import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, TestTube, Calendar, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const NurseInvestigations = () => {
  const [samples, setSamples] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    sampleType: 'Blood',
    hivScreening: 'Not Done',
    collectionNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSamples([...samples, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      sampleType: 'Blood',
      hivScreening: 'Not Done',
      collectionNotes: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Investigations</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record investigation samples and screening</p>

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
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Sample Date
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
                  <TestTube className="w-4 h-4 inline mr-1" />
                  Sample Type
                </label>
                <select
                  value={formData.sampleType}
                  onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                >
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Swab">Swab</option>
                  <option value="Tissue">Tissue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HIV Screening Information
                </label>
                <select
                  value={formData.hivScreening}
                  onChange={(e) => setFormData({ ...formData, hivScreening: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Consent Given">Consent Given</option>
                  <option value="Consent Refused">Consent Refused</option>
                  <option value="Test Done">Test Done</option>
                  <option value="Results Pending">Results Pending</option>
                  <option value="Results Received">Results Received</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Sample Collection Notes
                </label>
                <textarea
                  value={formData.collectionNotes}
                  onChange={(e) => setFormData({ ...formData, collectionNotes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Any notes about sample collection..."
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Record Sample
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Samples</h3>
            {samples.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No samples recorded yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {samples.slice().reverse().map((s, index) => {
                  const patient = patients.find(p => p.id === parseInt(s.patientId));
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <TestTube className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{s.sampleType}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{s.date}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">HIV: {s.hivScreening}</p>
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

export default NurseInvestigations;