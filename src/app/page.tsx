'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  router.push('/point/trade');
  return <div>Home</div>;
}
