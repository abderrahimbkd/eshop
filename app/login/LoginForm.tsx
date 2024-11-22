/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import Heading from '../components/Heading';
import Input from '../inputs/input';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import Button from '../components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/types';

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, []);

  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setisLoading(true);
    signIn('credentials', { ...data, redirect: false }).then((callback) => {
      setisLoading(false);
      if (callback?.ok) {
        router.push('/cart');
        router.refresh();
        toast.success('Logged In ');
      }
    });
  };

  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting </p>;
  }

  return (
    <>
      <Heading title="Sign in to E-Shop" />
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {signIn('google')}} />
      <hr className="bg-slate-300 w-full h-[1px]" />

      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password" />
      <Button label={isLoading ? 'Loading' : 'Login '} onClick={handleSubmit(onSubmit)} />
      <p className="text-sm">
        Do not have an account{' '}
        <Link className="underline" href="/register">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
