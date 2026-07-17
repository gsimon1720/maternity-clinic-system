import { useParams } from 'react-router-dom';
import { patients } from '../../data/patients';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Heart, Baby, Calendar, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams();
  const patient = patients.find(p => p.id === parseInt(id));

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Patient Profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button className="bg-primary hover:bg-red-600 text-white">Add Record</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">
                  {patient.firstName[0]}{patient.lastName[0]}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Patient ID: #{patient.id.toString().padStart(4, '0')}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} ({patient.age} years)
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{patient.address}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {patient.emergencyContact.relationship}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {patient.emergencyContact.phone}
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" />
                Pregnancy Information
              </div>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium">{patient.pregnancy.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weeks</p>
                <p className="font-medium">{patient.pregnancy.weeks} weeks</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="font-medium">{new Date(patient.pregnancy.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gravida</p>
                <p className="font-medium">{patient.pregnancy.gravida}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Para</p>
                <p className="font-medium">{patient.pregnancy.para}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Blood Group</p>
                <p className="font-medium">{patient.bloodGroup}</p>
              </div>
            </div>
            {patient.pregnancy.highRisk && (
              <div className="mt-4 p-3 bg-danger/10 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-danger" />
                <span className="text-danger font-medium">High Risk Pregnancy</span>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Recent Clinical Records
              </div>
            </h3>
            <div className="space-y-3">
              {patient.clinicalRecords.map((record) => (
                <div key={record.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{record.chiefComplaint}</p>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{record.assessment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;