'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LegacyPathEditorRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    const target = id ? `/path/new-editor?id=${encodeURIComponent(id)}` : '/path/new-editor';
    router.replace(target);
  }, [router, searchParams]);

  return null;
}

export default function PathEditorPage() {
  return (
    <Suspense>
      <LegacyPathEditorRedirect />
    </Suspense>
  );
}
