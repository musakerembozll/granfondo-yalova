import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addHeroVideo() {
  const videoUrl = 'https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4'
  
  console.log('Adding hero video to database...')
  console.log('URL:', videoUrl)
  
  const { data, error } = await supabase
    .from('site_images')
    .upsert({
      key: 'hero_video',
      url: videoUrl,
      label: 'Hero Video'
    }, { onConflict: 'key' })
    .select()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success! Video added:', data)
  }
  
  // Verify
  const { data: check } = await supabase
    .from('site_images')
    .select('*')
    .eq('key', 'hero_video')
    .single()
  
  console.log('Current hero_video in database:', check)
}

addHeroVideo()
