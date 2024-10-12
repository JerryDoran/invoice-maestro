import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
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

export default async function DashboardPage() {
  const invoices = await db.select().from(Invoices);

  return (
    <main className='flex justify-center gap-6 flex-col text-center max-w-5xl mx-auto my-12'>
      <div className='flex justify-between'>
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
                  Tony Stark
                </Link>
              </TableCell>
              <TableCell className='text-left p-0'>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className='font-semibold py-4 block'
                >
                  tony@avengers.com
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
    </main>
  );
}
