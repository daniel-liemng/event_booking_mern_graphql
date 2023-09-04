import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import Navbar from './components/Navbar';
import { AppContext } from './context/AppContext';
import { useState } from 'react';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import AuthRoute from './protectedRoutes/AuthRoute';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token ? token : null;
};

const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem('userId');
  return userId ? userId : null;
};

const App = () => {
  const [token, setToken] = useState(getTokenFromLocalStorage());
  const [userId, setUserId] = useState(getUserIdFromLocalStorage());

  return (
    <AppContext.Provider value={{ token, userId, setToken, setUserId }}>
      <ApolloProvider client={client}>
        <Router>
          <Navbar />
          <main className='pt-[70px]'>
            <Routes>
              <Route
                path='/'
                element={
                  <AuthRoute>
                    <Auth />
                  </AuthRoute>
                }
              />
              <Route
                path='/auth'
                element={
                  <AuthRoute>
                    <Auth />
                  </AuthRoute>
                }
              />
              <Route path='/events' element={<Events />} />
              <Route
                path='/bookings'
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </Router>
      </ApolloProvider>
    </AppContext.Provider>
  );
};

export default App;
