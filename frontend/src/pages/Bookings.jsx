import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../graphql/queries/bookingQueries';
import Spinner from '../components/Spinner';
import BookingList from '../components/BookingList';
import { useEffect } from 'react';

const Bookings = () => {
  const { data, loading, error, refetch } = useQuery(GET_BOOKINGS);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  return (
    <div>
      <BookingList bookings={data.bookings} />
    </div>
  );
};

export default Bookings;
