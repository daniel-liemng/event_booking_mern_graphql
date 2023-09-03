import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';

const Events = () => {
  const { token, userId } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);

  console.log('888', token);
  console.log('88899', userId);

  console.log('11', showModal);

  return (
    <div>
      <button type='button' onClick={() => setShowModal(true)}>
        Create Event
      </button>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title='Create Event'
          onConfirm={() => {}}
        >
          <h1>Hello</h1>
        </Modal>
      )}
    </div>
  );
};

export default Events;
