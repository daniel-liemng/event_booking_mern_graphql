import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { CANCEL_BOOKING } from '../graphql/mutations/bookingMutation';
import { GET_BOOKINGS } from '../graphql/queries/bookingQueries';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BookingList = ({ bookings }) => {
  const { token } = useContext(AppContext);

  const [cancelBooking] = useMutation(CANCEL_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });

  const handleCancelBooking = (bookingId) => {
    // Not Authenticated
    if (!token) {
      return alert('Unauthenticated');
    }

    cancelBooking({ variables: { bookingId } });
  };

  return (
    <div className='mt-4 flex flex-wrap gap-4 justify-center'>
      {bookings.length > 0 &&
        bookings.map((booking) => (
          <div
            key={booking?.id}
            className='w-[400px] p-3 rounded-md border border-gray-300 shadow-sm flex items-center justify-between'
          >
            <div>
              <h3 className='text-2xl font-semibold'>
                {booking?.event?.title}
              </h3>
              <h3 className='text-lg font-semibold'>
                {new Date(booking?.event?.date).toLocaleDateString()}
              </h3>
            </div>
            <button
              type='button'
              onClick={() => handleCancelBooking(booking.id)}
              className='px-4 py-1 bg-orange-500 rounded-md  font-semibold hover:text-white hover:bg-orange-600'
            >
              Cancel
            </button>
          </div>
        ))}
    </div>
  );
};

BookingList.propTypes = {
  bookings: PropTypes.array,
};

export default BookingList;
