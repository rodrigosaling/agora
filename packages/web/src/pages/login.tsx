/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HttpError, postData } from '../api/post-data';
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants/local-storage';
import EMAIL_VALIDATION_REGEX from '../constants/email-regex';

type Inputs = {
  email: string;
};

export default function Login() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: Record<string, string>) =>
      postData('/login', formData),
    onSuccess: ({ refreshToken, accessToken }) => {
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
      navigate('/home');
    },
  });

  const isCustomError = mutation.error instanceof HttpError;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) =>
    mutation.mutate(formData);

  return (
    <main>
      <div className="flex flex-col items-center mt-36">
        <h1 className="text-2xl font-bold">Events</h1>
        <form
          method="POST"
          action="/login"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="field-wrapper">
            <label htmlFor="email" className="block font-bold">
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email required',
                pattern: {
                  value: EMAIL_VALIDATION_REGEX,
                  message: 'Invalid email',
                },
              })}
              className="w-64 p-2 border border-gray-300 rounded-md mt-1"
            />
            {errors.email && (
              <div className="text-red-700">{errors.email.message}</div>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Login
          </button>
        </form>
        {mutation.isError && isCustomError && (
          <div className="border bg-blue-300 p-3 rounded-md border-blue-600">
            <strong>{mutation.error?.response.title}</strong>
            <p>{mutation.error?.response.detail}</p>
          </div>
        )}
        {mutation.isError && !isCustomError && (
          <div className="border bg-blue-300 p-3 rounded-md border-blue-600">
            <strong>{mutation.error.message}</strong>
          </div>
        )}
      </div>
    </main>
  );
}
