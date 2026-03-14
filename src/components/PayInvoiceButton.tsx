// src/components/PayInvoiceButton.tsx
import { createCheckoutSession } from '@/lib/actions/stripe';
import { CreditCard } from 'lucide-react';
export default function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  // This "pre-loads" the function with the ID so it's ready for the form action
  const handlePay = createCheckoutSession.bind(null, invoiceId);

  return (
    <form action={handlePay}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95"
      >
        <CreditCard size={18} />
        Pay Invoice
      </button>
    </form>
  );
}
