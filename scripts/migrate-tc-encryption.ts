/**
 * Migration script to encrypt existing TC Kimlik numbers
 * Run with: npx tsx scripts/migrate-tc-encryption.ts
 */

import { createClient } from '@supabase/supabase-js'
import { encrypt, isEncrypted } from '../lib/security/encryption'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateTcNumbers() {
    console.log('Starting TC Kimlik encryption migration...')
    
    // Fetch all applications
    const { data: applications, error } = await supabase
        .from('applications')
        .select('id, tc_no')
    
    if (error) {
        console.error('Error fetching applications:', error)
        process.exit(1)
    }
    
    if (!applications || applications.length === 0) {
        console.log('No applications found')
        return
    }
    
    console.log(`Found ${applications.length} applications`)
    
    let migrated = 0
    let skipped = 0
    let errors = 0
    
    for (const app of applications) {
        // Skip if already encrypted
        if (isEncrypted(app.tc_no)) {
            console.log(`Skipping ${app.id} - already encrypted`)
            skipped++
            continue
        }
        
        try {
            const encryptedTcNo = encrypt(app.tc_no)
            
            const { error: updateError } = await supabase
                .from('applications')
                .update({ tc_no: encryptedTcNo })
                .eq('id', app.id)
            
            if (updateError) {
                console.error(`Error updating ${app.id}:`, updateError)
                errors++
            } else {
                console.log(`Migrated ${app.id}`)
                migrated++
            }
        } catch (err) {
            console.error(`Error encrypting ${app.id}:`, err)
            errors++
        }
    }
    
    console.log('\n=== Migration Complete ===')
    console.log(`Migrated: ${migrated}`)
    console.log(`Skipped (already encrypted): ${skipped}`)
    console.log(`Errors: ${errors}`)
}

migrateTcNumbers()
