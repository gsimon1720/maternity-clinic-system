import Card from '../../components/common/Card';
import DarkModeToggle from '../../components/common/DarkModeToggle';

const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <div className="max-w-2xl space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <DarkModeToggle />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
              <input type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              <input type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;