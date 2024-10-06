import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function InvoicePage() {
  return (
    <main className='flex justify-center gap-6 flex-col max-w-5xl mx-auto my-12'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold'>Create Invoice</h1>
      </div>

      <form className='grid gap-4 max-w-xs'>
        <div className=''>
          <Label
            className='block mb-2 font-semibold text-sm text-neutral-500'
            htmlFor='name'
          >
            Billing Name
          </Label>
          <Input id='name' name='name' type='text' />
        </div>
        <div className=''>
          <Label
            className='block mb-2 font-semibold text-sm text-neutral-500'
            htmlFor='email'
          >
            Billing Email
          </Label>
          <Input id='email' name='email' type='email' />
        </div>
        <div className=''>
          <Label
            className='block mb-2 font-semibold text-sm text-neutral-500'
            htmlFor='amount'
          >
            Amount
          </Label>
          <Input id='amount' name='amount' type='text' />
        </div>
        <div className=''>
          <Label
            className='block mb-2 font-semibold text-sm text-neutral-500'
            htmlFor='description'
          >
            Description
          </Label>
          <Textarea id='description' name='description' />
        </div>
        <div>
          <Button className='w-full font-semibold'>Submit</Button>
        </div>
      </form>
    </main>
  );
}
