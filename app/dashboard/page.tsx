import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { CirclePlus } from 'lucide-react';
import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Container from '@/components/container';
import { and, eq, isNull } from 'drizzle-orm';

export default async function DashboardPage() {
  const { userId, orgId } = auth();
  if (!userId) return;

  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  return (
    <main className='h-full'>
      <Container>
        <div className='flex justify-between mb-6'>
          <h1 className='text-3xl font-bold'>Invoices</h1>
          <p className=''>
            <Button variant='ghost' className='inline-flex gap-2' asChild>
              <Link href='/invoices/new'>
                <CirclePlus className='size-4' />
                Create invoice
              </Link>
            </Button>
          </p>
        </div>

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className='text-center'>Status</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className='font-medium text-left p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-4 block'
                  >
                    {new Date(invoice.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-4 block'
                  >
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-4 block'
                  >
                    {invoice.customer.email}
                  </Link>
                </TableCell>
                <TableCell className='text-center p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-4 block'
                  >
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
                  </Link>
                </TableCell>

                <TableCell className='text-right p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='font-semibold py-4 block'
                  >
                    ${(invoice.amount / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
