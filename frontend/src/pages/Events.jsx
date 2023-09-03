import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Events = () => {
  const { token, userId } = useContext(AppContext);
  console.log('888', token);
  console.log('88899', userId);
  return <div>Events</div>;
};

export default Events;
