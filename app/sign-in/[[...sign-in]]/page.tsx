import Container from '@/components/container';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <Container className='flex justify-center items-center'>
      <SignIn />
    </Container>
  );
}
