import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      if (isLogin) {
        await login(data.email, data.password);
        navigate('/dashboard');
      } else {
        await signup(data.email, data.password);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-blue-50">
      <div className="w-full max-w-md mx-auto p-10 rounded-3xl shadow-2xl bg-white animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-text-800 mb-6">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-rose-50 border border-rose-200 p-4 text-rose-700 text-center animate-fade-in">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-800 mb-1">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className={`block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-text-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 ${errors.email ? 'border-rose-500' : ''}`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-500 animate-fade-in">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-800 mb-1">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className={`block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-text-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 ${errors.password ? 'border-rose-500' : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-500 animate-fade-in">{errors.password.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-lg"
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-cyan-600 font-medium transition-colors duration-200"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 