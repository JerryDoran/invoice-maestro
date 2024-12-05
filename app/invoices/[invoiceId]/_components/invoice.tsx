/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useOptimistic } from 'react';
import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';

import { availableStatuses } from '@/data/invoices';

import { Badge } from '@/components/ui/badge';
import Container from '@/components/container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateStatus, deleteInvoice } from '@/actions';
import { ChevronDown, CreditCard, Ellipsis, Trash2 } from 'lucide-react';
import Link from 'next/link';

type InvoiceProps = {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
};

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );

  async function handleUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get('status'));

    try {
      await updateStatus(formData);
    } catch (error) {
      setCurrentStatus(originalStatus);
    }
  }

  return (
    <main className='mx-auto my-12 w-full'>
      <Container>
        <div className='flex justify-between mb-8'>
          <h1 className='text-3xl flex items-center gap-4 font-bold'>
            Invoice {invoice.id}
            <Badge
              className={cn(
                'rounded-full capitalize',
                currentStatus === 'paid' && 'bg-green-300',
                currentStatus === 'open' && 'bg-yellow-200',
                currentStatus === 'void' && 'bg-purple-300',
                currentStatus === 'uncollectible' && 'bg-red-300'
              )}
            >
              {currentStatus}
            </Badge>
          </h1>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='flex gap-2'>
                  Change Status
                  <ChevronDown className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableStatuses.map((status) => (
                  <DropdownMenuItem key={status.id}>
                    <form action={handleUpdateStatus}>
                      <input type='hidden' name='id' value={invoice.id} />
                      <input type='hidden' name='status' value={status.id} />
                      <button>{status.label}</button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='flex gap-2'>
                    <span className='sr-only'>More options</span>
                    <Ellipsis className='size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button className='flex items-center gap-2'>
                        <Trash2 className='size-4' />
                        Delete invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link
                      href={`/invoices/${invoice.id}/payment`}
                      className='flex items-center gap-2'
                    >
                      <CreditCard className='size-4' />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='text-2xl'>
                    Delete invoice?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your invoice.
                  </DialogDescription>
                  <DialogFooter>
                    <form action={deleteInvoice}>
                      <input type='hidden' name='id' value={invoice.id} />
                      <Button
                        variant='destructive'
                        className='flex items-center gap-2'
                        type='submit'
                      >
                        <Trash2 className='w-4 h-auto' />
                        Delete Invoice
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className='text-3xl mb-3'>${(invoice.amount / 100).toFixed(2)}</p>
        <p className='text-lg mb-8'>{invoice.description}</p>
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
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Email
            </strong>
            <span>{invoice.customer.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
