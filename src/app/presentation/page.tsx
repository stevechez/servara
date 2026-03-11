import HomeownerPresentation from '@/components/v2/HomeownerPresentation';
import { Suspense } from 'react';

export const metadata = { title: 'Proposal | Servara' };

function PresentationRoute() {
  return <HomeownerPresentation />;
}

export default function PresentationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PresentationRoute />
    </Suspense>
  );
}