/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { db } from '@/db';
import { Customers, Invoices, Status } from '@/db/schema';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_SECRET!);

export async function createInvoice(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const amount = Math.floor(
    Number.parseFloat(String(formData.get('amount'))) * 100
  );
  const description = formData.get('description') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  await db
    .insert(Invoices)
    .values({
      amount,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  // redirect(`/invoices/${invoices[0].id}`);
  redirect('/dashboard');
}

export async function updateStatus(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  let results;
  if (orgId) {
    results = await db
      .update(Invoices)
      .set({ status })
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    results = await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  console.log(results);
  revalidatePath(`/invoices/${id}`, 'page');
}

export async function deleteInvoice(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect('/dashboard');
}
