/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { postData } from '../api/post-data';
import { LOCAL_STORAGE_TOKEN } from '../constants/local-storage';

type Inputs = {
  email: string;
};

export default function Login() {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: (formData: Record<string, string>) =>
      postData('/login', formData),
    onSuccess: (response) => {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, response);
      navigate('/home');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => login.mutate(formData);

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Events</h1>
        <form method="POST" action="/login" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block font-bold">
              Enter your email
            </label>
            <input
              id="email"
              {...register('email', { required: true })}
              className="w-64 p-2 border border-gray-300 rounded-md mt-1"
            />
            {errors.email && <span>This field is required</span>}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
