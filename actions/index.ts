/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { db } from '@/db';
import { Invoices, Status } from '@/db/schema';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createInvoice(formData: FormData) {
  const { userId } = auth();
  const amount = Math.floor(
    Number.parseFloat(String(formData.get('amount'))) * 100
  );
  const description = formData.get('description') as string;

  if (!userId) return;

  await db
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

  // redirect(`/invoices/${invoices[0].id}`);
  redirect('/dashboard');
}

export async function updateStatus(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  console.log(results);
  revalidatePath(`/invoices/${id}`, 'page');
}

export async function deleteInvoice(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;

  const results = await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  console.log(results);
  redirect('/dashboard');
}
