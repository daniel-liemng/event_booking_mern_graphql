import { gql } from '@apollo/client';

export const GET_BOOKINGS = gql`
  query getBookings {
    bookings {
      id
      event {
        id
        title
        date
      }
      createdAt
      updatedAt
    }
  }
`;
