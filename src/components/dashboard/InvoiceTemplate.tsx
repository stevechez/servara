export default function InvoiceTemplate({ data }: { data: any }) {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-slate-100 bg-white p-12 text-slate-900 shadow-xl">
      <div className="flex justify-between border-b pb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Service Receipt</h1>
          <p className="text-xs text-slate-400">Job ID: {data.id.slice(0, 8)}</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Your Business Name</p>
          <p>123 Service Lane</p>
          <p>support@yourbusiness.com</p>
        </div>
      </div>

      <div className="my-8">
        <p className="text-[10px] font-black text-slate-400 uppercase">Billed To</p>
        <p className="font-bold">{data.customers?.name}</p>
        <p className="text-sm text-slate-600">{data.customers?.address}</p>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-[10px] font-black text-slate-400 uppercase">
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="py-4 font-medium">{data.services?.name} (Labor)</td>
            <td className="py-4 text-right">${data.services?.base_price}</td>
          </tr>
          // Inside your table body
          <tr>
            <td className="py-4 font-medium">
              {data.serviceDetails?.name || 'Standard Service'} (Labor)
            </td>
            <td className="py-4 text-right">${data.serviceDetails?.base_price || 0}</td>
          </tr>
          {data.job_parts.map((p: any, i: number) => (
            <tr key={i}>
              <td className="py-4 text-slate-600">
                {p.parts?.name} (x{p.quantity})
              </td>
              <td className="py-4 text-right">${p.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 border-t pt-8 text-right">
        <p className="text-xs font-bold text-slate-400 uppercase">Grand Total</p>
        <p className="text-4xl font-black text-blue-600">${data.grandTotal}</p>
      </div>
    </div>
  );
}
