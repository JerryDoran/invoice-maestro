import Container from '@/components/container';

export default function Footer() {
  return (
    <footer className='mt-20 mb-8'>
      <Container className='flex justify-between gap-4'>
        <p className='text-sm text-slate-500'>
          InvoiceMaestro &copy; {new Date().getFullYear()}
        </p>
        <p className='text-sm text-slate-500'>
          Created by The Web Architech with Next.js, Xata and Clerk Auth
        </p>
      </Container>
    </footer>
  );
}
