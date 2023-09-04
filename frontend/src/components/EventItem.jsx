import PropTypes from 'prop-types';
import moment from 'moment';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const EventItem = ({ event }) => {
  const { userId } = useContext(AppContext);

  return (
    <div className='w-[300px] p-3 border border-gray-300 rounded-md shadow-md'>
      <h3 className='text-3xl font-semibold text-center'>{event.title}</h3>
      <div className='flex items-center justify-between mt-3 px-2'>
        <p className='text-2xl font-semibold text-gray-700'>${event.price}</p>
        <p className='text-xl'>{moment(event.date).format('DD-MM-YYYY')}</p>
      </div>

      <div className='flex justify-end mt-4'>
        <button
          className='px-4 py-2 bg-orange-500 rounded-md font-semibold hover:text-white hover:bg-orange-600 disabled:bg-slate-100 disabled:hover:text-black'
          disabled={event.creator.id === userId}
        >
          {event.creator.id === userId ? 'You are a creator' : 'View More'}
        </button>
      </div>
    </div>
  );
};

EventItem.propTypes = {
  event: PropTypes.object,
};

export default EventItem;
