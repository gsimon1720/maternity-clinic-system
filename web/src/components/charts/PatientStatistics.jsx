import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { patients } from '../../data/patients';

const PatientStatistics = () => {
  // Generate monthly data for a trading chart feel
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totalPatients = patients.length;
    const highRiskCount = patients.filter(p => p.pregnancy.highRisk).length;
    const normalCount = patients.filter(p => !p.pregnancy.highRisk).length;
    
    // Create realistic monthly variations
    return months.map((month, index) => ({
      name: month,
      'Active Pregnancies': Math.round((totalPatients * 0.7) + (Math.random() * 20 - 10)),
      'High Risk': Math.round((highRiskCount * 0.8) + (Math.random() * 10 - 5)),
      'Normal': Math.round((normalCount * 0.8) + (Math.random() * 15 - 7)),
      'Total Patients': Math.round(totalPatients * 0.8 + (Math.random() * 30 - 15)),
      'Growth Rate': Math.round((Math.random() * 20 - 5) * 10) / 10,
    }));
  };

  const data = generateMonthlyData();

  // Calculate current statistics for display
  const currentStats = {
    total: patients.length,
    highRisk: patients.filter(p => p.pregnancy.highRisk).length,
    normal: patients.filter(p => !p.pregnancy.highRisk).length,
    active: patients.filter(p => p.pregnancy.status.includes('Active')).length,
  };

  return (
    <div className="space-y-4">
      {/* Statistics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Patients</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentStats.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentStats.active}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">High Risk</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{currentStats.highRisk}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentStats.normal}</p>
        </div>
      </div>

      {/* Main Chart - Trading Style */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend 
            wrapperStyle={{
              color: '#6B7280'
            }}
          />
          
          {/* Area charts for a trading feel */}
          <Area 
            type="monotone" 
            dataKey="Active Pregnancies" 
            stroke="#3B82F6" 
            fill="url(#colorActive)"
            strokeWidth={3}
            dot={false}
          />
          <Area 
            type="monotone" 
            dataKey="High Risk" 
            stroke="#EF4444" 
            fill="url(#colorHighRisk)"
            strokeWidth={3}
            dot={false}
          />
          <Area 
            type="monotone" 
            dataKey="Normal" 
            stroke="#10B981" 
            fill="url(#colorNormal)"
            strokeWidth={3}
            dot={false}
          />
          
          {/* Line for Total Patients overlay */}
          <Line 
            type="monotone" 
            dataKey="Total Patients" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#8B5CF6' }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Trading style indicators */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            +{Math.round((currentStats.active / currentStats.total) * 100)}%
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-xs text-gray-600 dark:text-gray-400">High Risk</span>
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            +{Math.round((currentStats.highRisk / currentStats.total) * 100)}%
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-xs text-gray-600 dark:text-gray-400">Normal</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            +{Math.round((currentStats.normal / currentStats.total) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientStatistics;