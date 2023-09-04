import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import Modal from '../components/Modal';
import { CREATE_EVENT } from '../graphql/mutations/eventMutation';
import { GET_EVENTS } from '../graphql/queries/eventQueries';
import EventList from '../components/EventList';
import Spinner from '../components/Spinner';

const Events = () => {
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const { data, loading, error } = useQuery(GET_EVENTS);

  const [createEvent] = useMutation(CREATE_EVENT, {
    variables: {
      title,
      description,
      date,
      price: +price,
    },
    update(cache, { data: { createEvent } }) {
      const { events } = cache.readQuery({ query: GET_EVENTS });
      cache.writeQuery({
        query: GET_EVENTS,
        data: {
          events: [...events, createEvent],
        },
      });
    },
  });

  const handleAddEvent = () => {
    if (!title || !description || !price || !date) {
      return alert('Please fill all fields');
    }

    const event = { title, description, price: +price, date };

    createEvent(event);

    setTitle('');
    setDescription('');
    setPrice('');
    setDate('');
    setShowModal(false);
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='p-6'>
      <button
        type='button'
        onClick={() => setShowModal(true)}
        className='px-4 py-2 bg-orange-500 rounded-md font-semibold hover:text-white hover:bg-orange-600'
      >
        Create Event
      </button>

      <EventList events={data?.events} />

      {/* Create Event Modal */}
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title='Create Event'
          onConfirm={handleAddEvent}
        >
          <form>
            <div className='mb-3'>
              <label htmlFor='title'>Title</label>
              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
                className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md bg-slate-100'
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='price'>Price</label>
              <input
                id='price'
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='Price'
                className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md bg-slate-100'
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='date'>Date</label>
              <input
                id='date'
                type='datetime-local'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder='Date'
                className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md bg-slate-100'
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='description'>Description</label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
                className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md bg-slate-100'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Events;
