import { notFound } from 'next/navigation';
import { db } from '@/db';
import { Invoices } from '@/db/schema';

import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

import Invoice from './_components/invoice';

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = auth();
  if (!userId) return;

  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID!');
  }

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!invoice) {
    notFound();
  }

  return <Invoice invoice={invoice} />;
}
