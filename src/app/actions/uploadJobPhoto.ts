'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadJobPhoto(formData: FormData) {
  const supabase = await createClient();
  
  const file = formData.get('file') as File;
  const jobId = formData.get('jobId') as string;
  const customerId = formData.get('customerId') as string;
  const type = formData.get('type') as 'before' | 'after';

  if (!file || !jobId) return { success: false, error: 'Missing file or job ID' };

  // 1. Create a unique, clean filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${jobId}-${type}-${Date.now()}.${fileExt}`;

  // 2. Upload the file to the 'job-photos' bucket
  const { error: uploadError } = await supabase.storage
    .from('job-photos')
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { success: false, error: uploadError.message };

  // 3. Get the public URL so we can display it
  const { data: { publicUrl } } = supabase.storage
    .from('job-photos')
    .getPublicUrl(fileName);

  // 4. Upsert (Update or Insert) the database record
  const { data: existingReport } = await supabase
    .from('job_reports')
    .select('id')
    .eq('job_id', jobId)
    .single();

  if (existingReport) {
    await supabase.from('job_reports')
      .update({ [`${type}_photo_url`]: publicUrl })
      .eq('id', existingReport.id);
  } else {
    await supabase.from('job_reports')
      .insert({
        job_id: jobId,
        customer_id: customerId,
        [`${type}_photo_url`]: publicUrl
      });
  }

  // Refresh the page to show the newly uploaded image
  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true, url: publicUrl };
}