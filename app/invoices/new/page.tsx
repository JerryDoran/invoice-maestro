'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createInvoice } from '@/actions';
import { SyntheticEvent, useState, startTransition } from 'react';
import SubmitButton from '@/components/submit-button';
import Container from '@/components/container';

export default function InvoicePage() {
  const [status, setStatus] = useState('ready');

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (status === 'pending') {
      return;
    }
    // set target as the form
    const target = e.target as HTMLFormElement;

    setStatus('pending');
    startTransition(async () => {
      const formData = new FormData(target);
      await createInvoice(formData);
    });
  }

  return (
    <main className='h-full'>
      <Container>
        <div className='flex justify-between mb-6'>
          <h1 className='text-3xl font-bold'>Create Invoice</h1>
        </div>

        <form
          action={createInvoice}
          onSubmit={handleSubmit}
          className='grid gap-4 max-w-xs'
        >
          <div className=''>
            <Label
              className='block mb-2 font-semibold text-sm text-neutral-500'
              htmlFor='name'
            >
              Billing Name
            </Label>
            <Input id='name' name='name' type='text' className='rounded-lg' />
          </div>
          <div className=''>
            <Label
              className='block mb-2 font-semibold text-sm text-neutral-500'
              htmlFor='email'
            >
              Billing Email
            </Label>
            <Input id='email' name='email' type='email' />
          </div>
          <div className=''>
            <Label
              className='block mb-2 font-semibold text-sm text-neutral-500'
              htmlFor='amount'
            >
              Amount
            </Label>
            <Input id='amount' name='amount' type='text' />
          </div>
          <div className=''>
            <Label
              className='block mb-2 font-semibold text-sm text-neutral-500'
              htmlFor='description'
            >
              Description
            </Label>
            <Textarea id='description' name='description' />
          </div>
          <SubmitButton />
        </form>
      </Container>
    </main>
  );
}
