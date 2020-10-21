import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup'; 
import { User } from '../../interfaces/user.interface';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('What? No username?')
    .max(16, 'Username cannot be longer than 16 characters'),
  password: Yup.string().required('Without a password, "None shall pass!"'),
  email: Yup.string().email('Please provide a valid email address (abc@xy.z)'),
});

const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({  
      resolver: yupResolver(schema)
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? '/auth/login' : '/auth/signup';
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='auth-main'>
      <div className='auth-card'>
        <div className='auth-head'>
          <h1>Diaries App</h1>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <div >
            <input ref={register} name='username' placeholder="Username" />
            {errors && errors.username && (
              <p className='errors'>{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              ref={register}
              name='password'
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className='errors'>{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <input
                ref={register}
                name='email'
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p className='errors'>{errors.email.message}</p>
              )}
            </div>
          )}

          <div>
            <button type="submit" disabled={loading}>
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </div>

          <p className='create-new' onClick ={() => setIsLogin(!isLogin)}>
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
