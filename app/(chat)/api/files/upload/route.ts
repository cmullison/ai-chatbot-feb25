/* eslint-disable import/no-unresolved */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

import { auth } from '@/app/(auth)/auth';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET_NAME = 'chat-blob'; // Define your Supabase bucket name here

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.user?.id) {
    return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();
    const filePath = `${session.user.id}/${Date.now()}-${filename}`; // Use a unique path, e.g., userId/timestamp-filename

    try {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true, // Set to true to overwrite existing files with the same name
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return NextResponse.json({ error: 'Upload failed', details: uploadError.message }, { status: 500 });
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
         console.error('Failed to get public URL for:', filePath);
         // Return the path even if public URL fails, or handle differently
         return NextResponse.json({ path: filePath, warning: 'Could not retrieve public URL' }, { status: 200 });
      }

      return NextResponse.json({ url: publicUrlData.publicUrl });
    } catch (error: any) {
      console.error('Upload process error:', error);
      // Ensure error is an instance of Error before accessing message
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      return NextResponse.json({ error: 'Upload failed', details: errorMessage }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
