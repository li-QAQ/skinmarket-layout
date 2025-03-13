'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TransactionPage() {
  const router = useRouter();

  // Redirect to buyer/request page by default
  useEffect(() => {
    router.push('/point/transaction/buyer/request');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
