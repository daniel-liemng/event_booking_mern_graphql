import { gql } from '@apollo/client';

export const CREATE_BOOKING = gql`
  mutation createBooking($eventId: ID!) {
    createBooking(eventId: $eventId) {
      id
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation cancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      id
      title
    }
  }
`;
