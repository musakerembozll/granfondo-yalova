/**
 * Password Migration Script
 *
 * This script migrates plain text passwords to bcrypt hashed passwords
 *
 * IMPORTANT: Run this AFTER executing the SQL migration (002_secure_passwords.sql)
 *
 * Usage:
 *   npx tsx scripts/migrate-passwords.ts
 *
 * Safety:
 *   - Creates backup before migration
 *   - Preserves existing passwords during migration
 *   - Verifies each hash after creation
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: Missing Supabase credentials')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface AdminUser {
    id: string
    username: string
    password: string
    password_hash?: string
    role: string
    name: string
}

async function migratePasswords() {
    console.log('🔐 Starting password migration...\n')

    try {
        // Step 1: Verify backup exists
        console.log('1️⃣  Checking backup table...')
        const { data: backupCheck, error: backupError } = await supabase
            .from('admin_users_backup')
            .select('count')
            .limit(1)

        if (backupError) {
            console.error('❌ Backup table not found!')
            console.error('Please run the SQL migration first (002_secure_passwords.sql)')
            process.exit(1)
        }
        console.log('✅ Backup table exists\n')

        // Step 2: Fetch all admin users
        console.log('2️⃣  Fetching admin users...')
        const { data: users, error: fetchError } = await supabase
            .from('admin_users')
            .select('id, username, password, password_hash, role, name')

        if (fetchError) {
            console.error('❌ Error fetching users:', fetchError.message)
            process.exit(1)
        }

        if (!users || users.length === 0) {
            console.log('⚠️  No users found to migrate')
            return
        }

        console.log(`✅ Found ${users.length} admin user(s)\n`)

        // Step 3: Migrate each user's password
        console.log('3️⃣  Migrating passwords...')

        for (const user of users as AdminUser[]) {
            // Skip if already migrated
            if (user.password_hash) {
                console.log(`⏭️  Skipping ${user.username} (already migrated)`)
                continue
            }

            // Skip if no password
            if (!user.password) {
                console.warn(`⚠️  Skipping ${user.username} (no password found)`)
                continue
            }

            console.log(`   Hashing password for: ${user.username}`)

            // Hash the password
            const hashedPassword = await bcrypt.hash(user.password, 10)

            // Verify the hash works
            const isValid = await bcrypt.compare(user.password, hashedPassword)
            if (!isValid) {
                console.error(`❌ Hash verification failed for ${user.username}`)
                console.error('Migration aborted for safety')
                process.exit(1)
            }

            // Update the database
            const { error: updateError } = await supabase
                .from('admin_users')
                .update({ password_hash: hashedPassword })
                .eq('id', user.id)

            if (updateError) {
                console.error(`❌ Error updating ${user.username}:`, updateError.message)
                process.exit(1)
            }

            console.log(`   ✅ Successfully migrated: ${user.username}`)
        }

        console.log('\n4️⃣  Verifying migration...')

        // Step 4: Verify all users have password_hash
        const { data: verifyUsers, error: verifyError } = await supabase
            .from('admin_users')
            .select('username, password_hash')

        if (verifyError) {
            console.error('❌ Verification error:', verifyError.message)
            process.exit(1)
        }

        const usersWithoutHash = (verifyUsers as any[]).filter(u => !u.password_hash)

        if (usersWithoutHash.length > 0) {
            console.warn('\n⚠️  Warning: The following users still have no password_hash:')
            usersWithoutHash.forEach(u => console.warn(`   - ${u.username}`))
            console.log('\nPlease review these users manually.')
        } else {
            console.log('✅ All users have hashed passwords\n')
        }

        // Step 5: Instructions for final cleanup
        console.log('5️⃣  Next steps:\n')
        console.log('   ⚠️  IMPORTANT: Test login functionality BEFORE removing old passwords!')
        console.log('   1. Test logging in with each admin account')
        console.log('   2. Verify JWT tokens are being created correctly')
        console.log('   3. Check that sessions work properly\n')
        console.log('   Once testing is complete, manually run in Supabase SQL editor:\n')
        console.log('   ALTER TABLE admin_users DROP COLUMN IF EXISTS password;')
        console.log('   ALTER TABLE admin_users ALTER COLUMN password_hash SET NOT NULL;\n')

        console.log('✅ Password migration completed successfully!')
        console.log('\n📊 Summary:')
        console.log(`   Total users: ${users.length}`)
        console.log(`   Migrated: ${users.filter((u: AdminUser) => u.password && !u.password_hash).length}`)
        console.log(`   Already migrated: ${users.filter((u: AdminUser) => u.password_hash).length}`)
        console.log(`   Skipped (no password): ${users.filter((u: AdminUser) => !u.password).length}`)

    } catch (error) {
        console.error('\n❌ Migration failed:', error)
        console.error('\nThe backup table (admin_users_backup) still exists.')
        console.error('You can restore from backup if needed.')
        process.exit(1)
    }
}

// Run the migration
console.log('═══════════════════════════════════════════════')
console.log('   GranFondo Yalova - Password Migration')
console.log('═══════════════════════════════════════════════\n')

migratePasswords()
    .then(() => {
        console.log('\n═══════════════════════════════════════════════')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
