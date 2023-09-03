import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <main className='pt-[70px]'>
          <Routes>
            <Route path='/' element={<Auth />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/events' element={<Events />} />
            <Route path='/bookings' element={<Bookings />} />
          </Routes>
        </main>
      </Router>
    </ApolloProvider>
  );
};

export default App;
