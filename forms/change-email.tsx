import { networkRequest } from '@src/utils/network-request';
import Joi from 'joi';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

type Props = {
  email: string;
};

const EmailSchema = Joi.string().email();

export function ChangeEmailForm(props: Props) {
  const [email, setEmail] = useState(props.email);
  const [error, setError] = useState('');

  const mutation = useMutation((payload: { email: string }) =>
    networkRequest({
      url: '/api/users',
      method: 'PUT',
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return <form></form>;
}
