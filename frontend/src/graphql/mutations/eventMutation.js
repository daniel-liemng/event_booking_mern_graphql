import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation createEvent(
    $title: String!
    $description: String!
    $date: String!
    $price: Float!
  ) {
    createEvent(
      title: $title
      description: $description
      date: $date
      price: $price
    ) {
      id
      title
      description
      date
      price
      creator {
        id
        email
      }
    }
  }
`;
