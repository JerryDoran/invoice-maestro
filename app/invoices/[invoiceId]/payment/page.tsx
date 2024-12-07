/* eslint-disable @typescript-eslint/no-unused-vars */

import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';
import Stripe from 'stripe';

import { Badge } from '@/components/ui/badge';
import Container from '@/components/container';

import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';
import { createPayment, updateStatus } from '@/actions';

const stripe = new Stripe(process.env.STRIPE_API_SECRET!);

type InvoicePageProps = {
  params: { invoiceId: string };
  searchParams: { status: string; session_id: string };
};

export default async function Invoice({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoiceId = parseInt(params.invoiceId);

  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === 'success';
  const isCanceled = searchParams.status === 'canceled';
  let isError = isSuccess && !sessionId;

  console.log('isSuccess', isSuccess);
  console.log('isCanceled', isCanceled);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID!');
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    if (payment_status !== 'paid') {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append('id', params.invoiceId);
      formData.append('status', 'paid');
      await updateStatus(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      amount: Invoices.amount,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }
  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className='mx-auto my-12 w-full'>
      <Container>
        {isError && (
          <p className='bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-5'>
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className='bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-5'>
            Payment was canceled, please try again!
          </p>
        )}
        <div className='grid grid-cols-2'>
          <div>
            <div className='flex justify-between mb-8'>
              <h1 className='text-3xl flex items-center gap-4 font-bold'>
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    'rounded-full capitalize',
                    invoice.status === 'paid' && 'bg-green-300',
                    invoice.status === 'open' && 'bg-yellow-200',
                    invoice.status === 'void' && 'bg-purple-300',
                    invoice.status === 'uncollectible' && 'bg-red-300'
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>
            <p className='text-3xl mb-3'>
              ${(invoice.amount / 100).toFixed(2)}
            </p>
            <p className='text-lg mb-8'>{invoice.description}</p>
          </div>
          <div>
            <h2 className='text-xl mb-4 font-semibold'>Manage invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input type='hidden' name='id' value={invoice.id} />
                <Button className='flex gap-2 bg-green-700 font-bold text-white hover:bg-green-600 transition-colors'>
                  <CreditCard className='size-5' />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className='text-xl font-bold flex items-center gap-2'>
                <Check className='size-6 bg-green-500 p-1 rounded-full font-semibold' />
                Invoice Paid
              </p>
            )}
          </div>
        </div>

        <h2 className='font-bold text-lg mb-4'>Billing Details</h2>
        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
          {/* <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Email
            </strong>
            <span>{invoice.customer.email}</span>
          </li> */}
        </ul>
      </Container>
    </main>
  );
}
