import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { appointments } from '../../data/appointments';

const AppointmentStatistics = () => {
  const data = [
    { name: 'Upcoming', value: appointments.filter(a => a.status === 'Upcoming').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'Completed').length },
  ];

  const COLORS = ['#EF4444', '#10B981'];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AppointmentStatistics;