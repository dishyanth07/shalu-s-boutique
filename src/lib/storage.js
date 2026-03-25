import { supabase } from './supabase'

/**
 * Uploads a file to Supabase Storage and returns the public URL
 * @param {File} file - The file object from input
 * @param {string} bucket - The bucket name (e.g. 'boutique-assets')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImage = async (file, bucket = 'boutique-assets') => {
  try {
    // 1. Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // 2. Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError)
      throw new Error(uploadError.message || 'Upload failed')
    }

    // 3. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}
