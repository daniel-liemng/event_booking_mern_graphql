import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { token, setToken } = useContext(AppContext);
  return (
    <div className='h-[70px] bg-orange-400 w-full flex items-center justify-between px-12 fixed'>
      <Link to='/' className='text-3xl font-bold'>
        Event Booking
      </Link>
      <div className='flex gap-4 items-center'>
        {!token && (
          <Link
            to='/auth'
            className='text-lg font-semibold hover:text-gray-600'
          >
            Login
          </Link>
        )}
        <Link
          to='/events'
          className='text-lg font-semibold hover:text-gray-600'
        >
          Events
        </Link>
        {token && (
          <div className='flex gap-4 items-center'>
            <Link
              to='/bookings'
              className='text-lg font-semibold hover:text-gray-600'
            >
              Bookings
            </Link>
            <button
              type='button'
              onClick={() => setToken('')}
              className='text-lg font-semibold hover:text-gray-600'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
