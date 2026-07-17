import Card from '../../components/common/Card';
import { appointments } from '../../data/appointments';

const DoctorAppointments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appointments</h1>
      <Card className="p-6">
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">{appointment.patientName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.date} at {appointment.time}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                appointment.status === 'Upcoming' ? 'bg-success/10 text-success' : 'bg-gray-200 text-gray-600'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DoctorAppointments;