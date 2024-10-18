import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalHours = tasks.reduce((acc, task) => {
    const start = new Date(`1970-01-01T${task.startTime}`);
    const end = new Date(`1970-01-01T${task.endTime}`);
    const diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    return acc + diff;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Total Hours Scheduled</h3>
          <p className="text-3xl font-bold">{totalHours.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
