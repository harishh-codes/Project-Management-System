import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { User } from '../src/models/user.model.js'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env')

dotenv.config({ path: envPath })

const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123', // Change this to a secure password
  fullName: 'Admin User',
  role: 'admin',
  isEmailVerified: true
}

async function createAdminUser() {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file')
    }

    console.log('🔄 Connecting to MongoDB...')
    console.log('URI:', process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email })
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log('Email:', existingAdmin.email)
      console.log('Username:', existingAdmin.username)
      console.log('Role:', existingAdmin.role)
      
      // Option to update role if not admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin'
        await existingAdmin.save()
        console.log('✅ Updated user role to admin')
      }
      
      process.exit(0)
    }

    console.log('\n🔐 Creating admin user with credentials:')
    console.log('Username:', ADMIN_CREDENTIALS.username)
    console.log('Email:', ADMIN_CREDENTIALS.email)
    console.log('Password: [hidden]')
    console.log('Role: admin\n')

    // Create new admin user
    const adminUser = new User({
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
      fullName: ADMIN_CREDENTIALS.fullName,
      role: ADMIN_CREDENTIALS.role,
      isEmailVerified: ADMIN_CREDENTIALS.isEmailVerified
    })

    await adminUser.save()
    console.log('✅ Admin user created successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('─'.repeat(50))
    console.log('Email:', ADMIN_CREDENTIALS.email)
    console.log('Password:', ADMIN_CREDENTIALS.password)
    console.log('─'.repeat(50))
    console.log('\n⚡ Next Steps:')
    console.log('1. Go to http://localhost:5173/login')
    console.log('2. Login with the credentials above')
    console.log('3. Navigate to http://localhost:5173/admin')
    console.log('\n🔒 SECURITY WARNING:')
    console.log('Please change the admin password after first login!')
    console.log('Update credentials in backend/scripts/create-admin.js\n')

    await mongoose.connection.close()
    console.log('✅ Connection closed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('\n⚠️  User with this email or username already exists!')
    }
    process.exit(1)
  }
}

createAdminUser()
