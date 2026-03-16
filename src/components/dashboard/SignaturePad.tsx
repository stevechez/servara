'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, RotateCcw, Check, Loader2 } from 'lucide-react';
import { updateSignature } from '@/app/actions/tech-actions';

export default function SignaturePad({
  jobId,
  initialSignature,
}: {
  jobId: string;
  initialSignature?: string;
}) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSigned, setHasSigned] = useState(!!initialSignature);

  const clear = () => {
    sigCanvas.current?.clear();
    setHasSigned(false);
  };

  const save = async () => {
    if (sigCanvas.current?.isEmpty()) return alert('Please provide a signature first.');

    setIsSaving(true);
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

    if (signatureData) {
      await updateSignature(jobId, signatureData);
      setHasSigned(true);
    }
    setIsSaving(false);
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
      <h2 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
        <PenTool size={14} /> Customer Authorization
      </h2>

      {hasSigned && initialSignature ? (
        <div className="flex flex-col items-center gap-4">
          <img src={initialSignature} alt="Signature" className="max-h-32 brightness-200 invert" />
          <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
            Signed & Verified
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/5">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="white"
              canvasProps={{ className: 'w-full h-40 cursor-crosshair' }}
              onBegin={() => setHasSigned(true)}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={clear}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:bg-white/5"
            >
              <RotateCcw size={14} /> Clear
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[10px] font-black tracking-widest text-white uppercase hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Confirm Signature
            </button>
          </div>
        </>
      )}
    </div>
  );
}
