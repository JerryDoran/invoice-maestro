import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function Home() {
  return (
    <main className='flex justify-center gap-6 flex-col h-screen text-center max-w-5xl mx-auto'>
      <h1 className='text-5xl font-bold'>Invoice Maestro</h1>
      <p>
        
        <Button asChild>
          <Link href='/dashboard'>Sign in</Link>
        </Button>
      </p>
    </main>
  );
}
