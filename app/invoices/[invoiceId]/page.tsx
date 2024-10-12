import { Badge } from '@/components/ui/badge';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  return (
    <main className='max-w-5xl mx-auto my-12'>
      <div className='flex justify-between mb-8'>
        <h1 className='text-3xl flex items-center gap-4 font-bold'>
          Invoice {invoiceId}
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

        <p className=''></p>
      </div>
      <p className='text-3xl mb-3'>${(invoice.amount / 100).toFixed(2)}</p>
      <p className='text-lg mb-8'>{invoice.description}</p>
      <h2 className='font-bold text-lg mb-4'>Billing Details</h2>
      <ul className='grid gap-2'>
        <li className='flex gap-4'>
          <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
            Invoice ID
          </strong>
          <span>{invoiceId}</span>
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
          <span></span>
        </li>
        <li className='flex gap-4'>
          <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
            Billing Email
          </strong>
          <span></span>
        </li>
      </ul>
    </main>
  );
}
