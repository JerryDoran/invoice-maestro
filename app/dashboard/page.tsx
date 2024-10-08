import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
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

export default function DashboardPage() {
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
          <TableRow>
            <TableCell className='font-medium text-left py-4'>
              <span className='font-semibold'>10/15/2024</span>
            </TableCell>
            <TableCell className='text-left py-4'>
              <span className='font-semibold'>Tony Stark</span>
            </TableCell>
            <TableCell className='text-left py-4'>
              <span className=''>tony@avengers.com</span>
            </TableCell>
            <TableCell className='text-center py-4'>
              <Badge className='rounded-full'>Paid</Badge>
            </TableCell>

            <TableCell className='text-right py-4'>
              <span className='font-semibold'></span>$2500.00
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium text-left py-4'>
              <span className='font-semibold'>10/25/2024</span>
            </TableCell>
            <TableCell className='text-left py-4'>
              <span className='font-semibold'>Steve Rogers</span>
            </TableCell>
            <TableCell className='text-left py-4'>
              <span className=''>steve@avengers.com</span>
            </TableCell>
            <TableCell className='text-center py-4'>
              <Badge className='rounded-full'>Open</Badge>
            </TableCell>

            <TableCell className='text-right py-4'>
              <span className='font-semibold'></span>$250.00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
