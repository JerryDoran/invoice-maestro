/* eslint-disable @typescript-eslint/no-unused-vars */

import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import Container from '@/components/container';

import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';

export default async function Invoice({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID!');
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
              <form action=''>
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
