import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Calendar, Heart } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const Ultrasound = () => {
  const [ultrasounds, setUltrasounds] = useState(
    patients.filter(p => p.ultrasound).map(p => ({
      ...p.ultrasound,
      patientName: `${p.firstName} ${p.lastName}`,
      patientId: p.id
    }))
  );
  const [formData, setFormData] = useState({
    patientId: '',
    edd: '',
    correctedEdd: '',
    poaAtScan: '',
    findings: '',
    doctorNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUltrasounds([...ultrasounds, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      edd: '',
      correctedEdd: '',
      poaAtScan: '',
      findings: '',
      doctorNotes: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ultrasound Details</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record and manage ultrasound scan details</p>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    EDD (Estimated Due Date)
                  </label>
                  <input
                    type="date"
                    value={formData.edd}
                    onChange={(e) => setFormData({ ...formData, edd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Corrected EDD
                  </label>
                  <input
                    type="date"
                    value={formData.correctedEdd}
                    onChange={(e) => setFormData({ ...formData, correctedEdd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  POA at Scan (Weeks)
                </label>
                <input
                  type="number"
                  value={formData.poaAtScan}
                  onChange={(e) => setFormData({ ...formData, poaAtScan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ultrasound Findings
                </label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Describe ultrasound findings..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctor Notes
                </label>
                <textarea
                  value={formData.doctorNotes}
                  onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Additional doctor notes..."
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Ultrasound Record
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Scans</h3>
            {ultrasounds.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No ultrasound records yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {ultrasounds.slice().reverse().map((u, index) => {
                  const patient = patients.find(p => p.id === parseInt(u.patientId));
                  return (
                    <motion.div
                      key={u.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          {u.edd && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              EDD: {u.edd}
                            </p>
                          )}
                          {u.poaAtScan && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">POA: {u.poaAtScan} weeks</p>
                          )}
                          {u.findings && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{u.findings}</p>
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

export default Ultrasound;