import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { User, Mail, Phone, Stethoscope } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{user?.phone || 'Not provided'}</span>
            </div>
            {user?.role === 'doctor' && (
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{user?.specialization}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button className="bg-primary hover:bg-red-600 text-white">Edit Profile</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;