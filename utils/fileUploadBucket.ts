import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  'https://zrigpkyppmnrzpghumko.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaWdwa3lwcG1ucnpwZ2h1bWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTM5NjQ1NSwiZXhwIjoyMDM0OTcyNDU1fQ.p3qvnDRGkohkByLxr4K7CX418Gapoph-TzhRzuDJi24',
);

// Upload file using standard upload
export async function uploadFile(file: Express.Multer.File) {
  const fileName = `${Date.now()}_${file.originalname}`;

  const { data, error } = await supabase.storage
    .from('siedo-bucket')
    .upload(fileName, file.buffer);
  if (error) {
    console.error('Upload failed:', error.message);
    throw new Error(`Upload failed: ${error.message}`);
  } else {
    const fileUrl = `https://zrigpkyppmnrzpghumko.supabase.co/storage/v1/object/public/${data.fullPath}`;
    return fileUrl;
  }
}
