'use server';

import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export async function createInvoice(formData: FormData) {
  const { userId } = auth();
  const amount = Math.floor(
    Number.parseFloat(String(formData.get('amount'))) * 100
  );
  const description = formData.get('description') as string;

  if (!userId) return;

  const invoices = await db
    .insert(Invoices)
    .values({
      amount,
      description,
      userId,
      status: 'open',
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${invoices[0].id}`);
}
