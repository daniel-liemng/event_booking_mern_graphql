import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  return (
    <div className='h-[70px] bg-orange-400 w-full flex items-center justify-between px-12 fixed'>
      <Link to='/' className='text-3xl font-bold'>
        Event Booking
      </Link>
      <div className='flex gap-4 items-center'>
        {!token && (
          <NavLink
            to='/auth'
            className='text-lg font-semibold hover:text-gray-600'
          >
            Login
          </NavLink>
        )}
        <NavLink
          to='/events'
          className='text-lg font-semibold hover:text-gray-600'
        >
          Events
        </NavLink>
        {token && (
          <div className='flex gap-4 items-center'>
            <NavLink
              to='/bookings'
              className='text-lg font-semibold hover:text-gray-600 '
            >
              Bookings
            </NavLink>
            <button
              type='button'
              onClick={() => {
                setToken('');
                localStorage.removeItem('token');
                navigate('/');
              }}
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
