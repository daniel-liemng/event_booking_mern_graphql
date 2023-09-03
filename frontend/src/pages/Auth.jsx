import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CREATE_USER, LOGIN } from '../graphql/mutations/userMutations';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: (data) => {
      console.log('signup', data);
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
        console.log('login', data);
      },
    }
  );

  // const { data, loading: loginLoading, error: loginError } = useQuery(LOGIN);

  const handleSignup = (e) => {
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

  if (loading || loginLoading) return <h4>Loading</h4>;
  // if (error || loginError)
  //   return <h4 className='text-red-500'>Error: {error?.message}</h4>;

  return (
    <div className='h-[60vh] max-h-[80vh] w-full flex justify-center mt-10'>
      <div className='w-[500px] bg-slate-50 p-5 rounded-md'>
        <h3 className='text-xl text-center font-semibold mb-5'>
          {isLogin ? 'Login' : 'Sign Up'}
        </h3>
        {error ||
          (loginError && (
            <h4 className='text-red-500'>Error: {error?.message}</h4>
          ))}
        <form onSubmit={handleSignup}>
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className='block my-2 w-full p-2 outline-none'
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='email'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='block my-2 w-full p-2 outline-none'
            />
          </div>
          <div className='my-5'>
            <button
              type='submit'
              className='px-4 py-2 bg-orange-400 rounded-md w-full'
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
