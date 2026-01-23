/**
 * Check current database schema for admin_users table
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function checkSchema() {
    console.log('🔍 Checking admin_users table schema...\n')

    // Get table columns
    const { data: columns, error: columnsError } = await supabase
        .rpc('exec_sql', {
            query: `
                SELECT
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_name = 'admin_users'
                ORDER BY ordinal_position
            `
        })

    if (columnsError) {
        // Try direct query instead
        console.log('📊 Fetching sample data from admin_users...\n')

        const { data: users, error: usersError } = await supabase
            .from('admin_users')
            .select('*')
            .limit(1)

        if (usersError) {
            console.error('❌ Error:', usersError.message)
            process.exit(1)
        }

        if (users && users.length > 0) {
            console.log('Sample row structure:')
            console.log(JSON.stringify(users[0], null, 2))
            console.log('\nColumns found:')
            Object.keys(users[0]).forEach(key => {
                console.log(`  - ${key}: ${typeof users[0][key]}`)
            })
        }

        // Get total count
        const { count } = await supabase
            .from('admin_users')
            .select('*', { count: 'exact', head: true })

        console.log(`\nTotal admin users: ${count}`)
    } else {
        console.log('Table columns:')
        console.table(columns)
    }
}

checkSchema()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
