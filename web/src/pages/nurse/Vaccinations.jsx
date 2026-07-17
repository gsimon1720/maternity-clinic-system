import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Syringe, Calendar, Package } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const Vaccinations = () => {
  const [vaccinations, setVaccinations] = useState(
    patients.flatMap(p => 
      p.vaccinations.map(v => ({
        ...v,
        patientName: `${p.firstName} ${p.lastName}`,
        patientId: p.id
      }))
    )
  );
  const [formData, setFormData] = useState({
    patientId: '',
    type: 'Tetanus Toxoid',
    dose: '',
    date: new Date().toISOString().split('T')[0],
    batchNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setVaccinations([...vaccinations, { id: Date.now(), ...formData }]);
    setFormData({
      patientId: '',
      type: 'Tetanus Toxoid',
      dose: '',
      date: new Date().toISOString().split('T')[0],
      batchNumber: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vaccinations</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Record patient vaccinations</p>

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
                  <Syringe className="w-4 h-4 inline mr-1" />
                  Vaccine Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                >
                  <option value="Tetanus Toxoid">Tetanus Toxoid</option>
                  <option value="COVID Vaccine">COVID Vaccine</option>
                  <option value="Hepatitis B">Hepatitis B</option>
                  <option value="Influenza">Influenza</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dose Number
                </label>
                <input
                  type="number"
                  value={formData.dose}
                  onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="e.g., 1, 2, 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date Given
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
                  <Package className="w-4 h-4 inline mr-1" />
                  Batch Number
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  placeholder="Enter batch number"
                  required
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-red-600 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Record Vaccination
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Vaccination History</h3>
            {vaccinations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No vaccinations recorded yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {vaccinations.slice().reverse().map((v, index) => {
                  const patient = patients.find(p => p.id === parseInt(v.patientId));
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Syringe className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{v.type}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Dose {v.dose} - {v.date}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Batch: {v.batchNumber}</p>
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

export default Vaccinations;