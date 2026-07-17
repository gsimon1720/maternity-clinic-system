import { patients } from '../../data/patients';
import Card from '../../components/common/Card';

const MedicalHistory = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Medical History</h1>
      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Medical history records will be displayed here.</p>
      </Card>
    </div>
  );
};

export default MedicalHistory;