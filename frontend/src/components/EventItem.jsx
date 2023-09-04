import PropTypes from 'prop-types';
import moment from 'moment';
import { useContext, useState } from 'react';

import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../graphql/mutations/bookingMutation';

const EventItem = ({ event }) => {
  const { userId, token } = useContext(AppContext);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [createBooking] = useMutation(CREATE_BOOKING, {
    variables: {
      eventId: event.id,
    },
  });

  const handleCreateBooking = () => {
    // Not authenticated
    if (!token) {
      return alert('Unauthenticated');
    }

    createBooking(event.id);
    setShowDetailsModal(false);
  };

  return (
    <div className='w-[300px] p-3 border border-gray-300 rounded-md shadow-md'>
      <h3 className='text-3xl font-semibold text-center'>{event.title}</h3>
      <div className='flex items-center justify-between mt-3 px-2'>
        <p className='text-2xl font-semibold text-gray-700'>${event.price}</p>
        <p className='text-xl'>{moment(event.date).format('DD-MM-YYYY')}</p>
      </div>

      <div className='flex justify-end mt-4'>
        <button
          type='button'
          onClick={() => setShowDetailsModal(true)}
          className='px-4 py-2 bg-orange-500 rounded-md font-semibold hover:text-white hover:bg-orange-600 disabled:bg-slate-100 disabled:hover:text-black'
          disabled={event.creator.id === userId}
        >
          {event.creator.id === userId ? 'You are a creator' : 'View More'}
        </button>
      </div>

      {showDetailsModal && (
        <Modal
          title='Event Details'
          setShowModal={setShowDetailsModal}
          onConfirm={handleCreateBooking}
          mainBtnText='Book'
          minorBtnText='Close'
        >
          <div className='flex flex-col gap-2'>
            <h3 className='text-3xl'>{event.title}</h3>
            <p>
              Price: <strong>${event.price}</strong>
            </p>
            <p>
              Date: <strong>{moment(event.date).format('DD-MM-YYYY')}</strong>
            </p>
            <p>{event.description}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

EventItem.propTypes = {
  event: PropTypes.object,
};

export default EventItem;
