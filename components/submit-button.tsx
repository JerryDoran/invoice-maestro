'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button className='relative w-full font-semibold'>
        <span className={pending ? 'text-transparent' : ''}>Submit</span>
        {pending && (
          <span className='absolute flex items-center justify-center w-full h-full text-gray-300'>
            <LoaderCircle className='animate-spin size-8' />
          </span>
        )}
      </Button>
    </div>
  );
}
