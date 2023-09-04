import PropTypes from 'prop-types';

import EventItem from './EventItem';

const EventList = ({ events }) => {
  return (
    <div className='mt-4 flex gap-3 items-center flex-wrap justify-center'>
      {events?.map((event) => (
        <EventItem event={event} key={event.id} />
      ))}
    </div>
  );
};

EventList.propTypes = {
  events: PropTypes.array,
};

export default EventList;
