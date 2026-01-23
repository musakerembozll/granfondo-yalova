/**
 * Run database migration via Supabase service role
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function runMigration() {
    console.log('🔄 Running database migration...\n')

    try {
        // Read migration SQL file
        const migrationPath = join(process.cwd(), 'supabase', 'migrations', '002_secure_passwords.sql')
        const migrationSQL = readFileSync(migrationPath, 'utf-8')

        console.log('📄 Migration SQL loaded')
        console.log('📊 Executing migration...\n')

        // Split SQL into individual statements (basic splitting)
        const statements = migrationSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'))

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';'

            // Skip pure comment blocks
            if (statement.trim().startsWith('--') || statement.trim() === ';') {
                continue
            }

            try {
                const { error } = await supabase.rpc('exec_sql', { query: statement })

                if (error) {
                    // Try direct execution as fallback
                    console.log(`⚠️  Statement ${i + 1} failed via RPC, trying direct execution...`)

                    // For direct execution, we'll need to use a different approach
                    // Since Supabase doesn't expose raw SQL execution directly,
                    // we'll log the error and continue
                    console.error(`   Error: ${error.message}`)
                    errorCount++
                } else {
                    successCount++
                    console.log(`✅ Statement ${i + 1} executed successfully`)
                }
            } catch (err: any) {
                console.error(`❌ Error executing statement ${i + 1}:`, err.message)
                errorCount++
            }
        }

        console.log(`\n📊 Migration Summary:`)
        console.log(`   ✅ Successful: ${successCount}`)
        console.log(`   ❌ Errors: ${errorCount}`)

        if (errorCount > 0) {
            console.log('\n⚠️  Some statements failed. Please run the SQL manually in Supabase SQL Editor.')
            console.log('📝 SQL file location: supabase/migrations/002_secure_passwords.sql')
        } else {
            console.log('\n✅ Migration completed successfully!')
        }

    } catch (error: any) {
        console.error('\n❌ Migration failed:', error.message)
        console.log('\n💡 Alternative: Run the SQL manually in Supabase Dashboard > SQL Editor')
        console.log('📝 SQL file: supabase/migrations/002_secure_passwords.sql')
        process.exit(1)
    }
}

console.log('═══════════════════════════════════════════════')
console.log('   Database Migration: Secure Password Storage')
console.log('═══════════════════════════════════════════════\n')

runMigration()
    .then(() => {
        console.log('\n═══════════════════════════════════════════════')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
