import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to ScheduleApp</h1>
      <p className="text-xl text-center mb-8">
        {user ? `Hello, ${user}!` : 'Hello, World!'}
      </p>
      {!user && (
        <div className="flex justify-center">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
