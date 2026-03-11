'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadJobPhoto } from '@/app/actions/uploadJobPhoto';
import imageCompression from 'browser-image-compression';

export default function BeforeAfterUploader({ 
  jobId, 
  customerId,
  existingBeforeUrl,
  existingAfterUrl
}: { 
  jobId: string;
  customerId: string;
  existingBeforeUrl?: string;
  existingAfterUrl?: string;
}) {
  const [uploading, setUploading] = useState<'before' | 'after' | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);

    try {
      // 1. The Magic Compression Settings
      const options = {
        maxSizeMB: 0.8, // Keeps it safely under the 1MB limit
        maxWidthOrHeight: 1920, // 1080p HD quality (plenty for PDF reports)
        useWebWorker: true,
        fileType: 'image/jpeg' // Forces HEIC to convert to standard JPEG
      };
      
      // 2. Compress the file right on the phone!
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      // Use the compressed file instead of the original
      formData.append('file', compressedFile, compressedFile.name); 
      formData.append('jobId', jobId);
      formData.append('customerId', customerId);
      formData.append('type', type);

      const result = await uploadJobPhoto(formData);
      
      if (!result.success) {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Compression or upload error:", error);
      alert("Something went wrong while processing the image.");
    } finally {
      setUploading(null);
    }
  }

  const PhotoBox = ({ type, url, label }: { type: 'before' | 'after', url?: string, label: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploading = uploading === type;

    return (
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        
        <div 
          onClick={() => !url && !isUploading && fileInputRef.current?.click()}
          className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden transition-all ${
            url 
              ? 'border-transparent shadow-lg' 
              : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-white/5 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 hover:border-blue-400 group'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-500">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Uploading...</span>
            </div>
          ) : url ? (
            <>
              <img src={url} alt={`${label} Photo`} className="w-full h-full object-cover" />
              {/* Optional: Add a retake button overlay */}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                <Camera size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Tap to Photo</span>
            </div>
          )}

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, type)}
            accept="image/*"
            capture="environment" /* Forces mobile browser to open rear camera */
            className="hidden" 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoBox type="before" url={existingBeforeUrl} label="Before Work" />
      <PhotoBox type="after" url={existingAfterUrl} label="After Work" />
    </div>
  );
}