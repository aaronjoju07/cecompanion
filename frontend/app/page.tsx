'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Events() {
  const router = useRouter();

  useEffect(() => {
    router.push('/event');
  }, []);

    return (
        <main className="w-full">

      </main>
    );
}