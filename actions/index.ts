'use server';

import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const amount = Math.floor(
    Number.parseFloat(String(formData.get('amount'))) * 100
  );
  const description = formData.get('description') as string;

  const invoices = await db
    .insert(Invoices)
    .values({
      amount,
      description,
      status: 'open',
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${invoices[0].id}`);
}
