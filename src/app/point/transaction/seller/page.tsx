'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SellerPage() {
  const router = useRouter();

  // Redirect to request page by default
  useEffect(() => {
    router.push('/point/transaction/seller/request');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
