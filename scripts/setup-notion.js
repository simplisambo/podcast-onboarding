// This script helps you set up your Notion database and get the necessary credentials
// Run this with: node scripts/setup-notion.js

const { Client } = require('@notionhq/client')
require('dotenv').config({ path: '.env.local' })

async function setupNotion() {
  console.log('🔧 Notion Database Setup Helper\n')
  
  // Check if environment variables are set
  if (!process.env.NOTION_TOKEN) {
    console.log('❌ NOTION_TOKEN not found in .env.local')
    console.log('📝 Please add your Notion integration token to .env.local')
    console.log('   Get it from: https://www.notion.so/my-integrations')
    return
  }
  
  if (!process.env.NOTION_DATABASE_ID) {
    console.log('❌ NOTION_DATABASE_ID not found in .env.local')
    console.log('📝 Please add your database ID to .env.local')
    console.log('   You can find it in the URL of your database')
    return
  }
  
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  
  try {
    console.log('🔍 Fetching database schema...')
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    })
    
    console.log('✅ Database found!')
    console.log(`📋 Database name: ${response.title[0]?.plain_text || 'Untitled'}`)
    console.log('\n📊 Available columns:')
    
    Object.entries(response.properties).forEach(([key, value]) => {
      console.log(`   • ${key} (${value.type})`)
    })
    
    console.log('\n💡 Recommended column names for this app:')
    console.log('   • Name (rich_text) - Required')
    console.log('   • Bio (rich_text) - Optional')
    console.log('   • Topics (rich_text) - Optional')
    console.log('   • Stories (rich_text) - Optional')
    console.log('   • Preferences (rich_text) - Optional')
    console.log('   • Expertise (rich_text) - Optional')
    
    console.log('\n🎯 Next steps:')
    console.log('   1. Make sure you have a "Name" column in your database')
    console.log('   2. Add any additional columns you want to display')
    console.log('   3. Add some test entries to your database')
    console.log('   4. Test the app with a URL like: /dr-smith or /john-doe')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.code === 'unauthorized') {
      console.log('\n🔑 Authentication failed. Please check your NOTION_TOKEN')
    } else if (error.code === 'object_not_found') {
      console.log('\n🔍 Database not found. Please check your NOTION_DATABASE_ID')
    }
  }
}

setupNotion() 