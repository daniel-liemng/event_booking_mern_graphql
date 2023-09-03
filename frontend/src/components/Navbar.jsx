import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='h-[70px] bg-orange-400 w-full flex items-center justify-between px-12 fixed'>
      <Link to='/' className='text-3xl font-bold'>
        Event Booking
      </Link>
      <div className='flex gap-4 items-center'>
        <Link to='/auth' className='text-lg font-semibold hover:text-gray-600'>
          Authenticate
        </Link>
        <Link
          to='/events'
          className='text-lg font-semibold hover:text-gray-600'
        >
          Events
        </Link>
        <Link
          to='/bookings'
          className='text-lg font-semibold hover:text-gray-600'
        >
          Bookings
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
