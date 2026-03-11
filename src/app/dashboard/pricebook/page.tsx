import PricebookManager from '@/components/v2/PricebookManager';

export const metadata = {
  title: 'Pricebook | Servara',
};

export default function PricebookPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PricebookManager />
    </div>
  );
}