import PricebookManager from '@/components/v2/PricebookManager';

export const metadata = {
  title: 'Pricebook | Zidro',
};

export default function PricebookPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PricebookManager />
    </div>
  );
}
