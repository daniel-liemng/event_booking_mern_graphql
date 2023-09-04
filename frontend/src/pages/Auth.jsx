import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import { CREATE_USER, LOGIN } from '../graphql/mutations/userMutations';
import { AppContext } from '../context/AppContext';
import Spinner from '../components/Spinner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setUserId } = useContext(AppContext);

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: () => {
      setIsLogin(true);
    },
  });

  const [login, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN,
    {
      variables: {
        email,
        password,
      },
      onCompleted: (data) => {
        setToken(data.login.token);
        setUserId(data.login.userId);
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('userId', data.login.userId);
      },
    }
  );

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert('Please fill all the fields');
    }

    if (isLogin) {
      login(email, password);
    } else {
      createUser(email, password);
    }
  };

  if (loading || loginLoading) return <Spinner />;

  return (
    <div className='h-[60vh] max-h-[80vh] w-full flex justify-center mt-10'>
      <div className='w-[500px] bg-slate-100 p-5 rounded-md'>
        <h3 className='text-xl text-center font-semibold mb-5'>
          {isLogin ? 'Login' : 'Sign Up'}
        </h3>
        {error ||
          (loginError && (
            <h4 className='text-red-500 font-semibold bg-gray-200 p-2'>
              Error: {error?.message}
            </h4>
          ))}
        <form onSubmit={handleAuthSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md'
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='block my-2 w-full p-2 outline-none focus:ring-2 focus:ring-blue-400 rounded-md'
            />
          </div>
          <div className='my-5'>
            <button
              type='submit'
              className='px-4 py-2 bg-orange-500 rounded-md w-full font-semibold hover:text-white hover:bg-orange-600'
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>

          <h6
            onClick={() => setIsLogin((prev) => !prev)}
            className='text-center text-blue-500 font-semibold cursor-pointer'
          >
            {isLogin ? 'Go to Signup' : 'Go to Login'}
          </h6>
        </form>
      </div>
    </div>
  );
};

export default Auth;
