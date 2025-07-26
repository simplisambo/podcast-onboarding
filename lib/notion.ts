import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export interface GuestData {
  id: string
  name: string
  pageContent?: string
}

export async function findGuestByLastName(lastName: string): Promise<GuestData | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Name', // Replace with your actual column name
        rich_text: {
          contains: lastName,
        },
      },
    })

    if (response.results.length === 0) {
      return null
    }

    // Find the exact match by checking if the last word matches
    const exactMatch = response.results.find((page: any) => {
      const nameProperty = page.properties.Name
      let fullName = ''
      
      // Handle both title and rich_text types
      if (nameProperty.title && nameProperty.title.length > 0) {
        fullName = nameProperty.title[0].plain_text
      } else if (nameProperty.rich_text && nameProperty.rich_text.length > 0) {
        fullName = nameProperty.rich_text[0].plain_text
      } else {
        return false
      }
      
      const nameWords = fullName.split(' ')
      const pageLastName = nameWords[nameWords.length - 1].toLowerCase()
      
      return pageLastName === lastName.toLowerCase()
    })

    if (!exactMatch) {
      return null
    }

    // Get the page ID and fetch the full page content
    const pageId = exactMatch.id
    const pageProperties = exactMatch.properties
    
    // Fetch the page content using block children
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
    })

    // Extract text content from all blocks
    let pageContent = ''
    for (const block of blocksResponse.results) {
      if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
        pageContent += block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
      } else if (block.type === 'heading_1' && block.heading_1.rich_text.length > 0) {
        pageContent += '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
      } else if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
        pageContent += '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
      } else if (block.type === 'heading_3' && block.heading_3.rich_text.length > 0) {
        pageContent += '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
      } else if (block.type === 'bulleted_list_item' && block.bulleted_list_item.rich_text.length > 0) {
        pageContent += '• ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n'
      } else if (block.type === 'numbered_list_item' && block.numbered_list_item.rich_text.length > 0) {
        pageContent += '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n'
      } else if (block.type === 'quote' && block.quote.rich_text.length > 0) {
        pageContent += '> ' + block.quote.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
      }
    }

    return {
      id: pageId,
      name: pageProperties.Name?.title?.[0]?.plain_text || pageProperties.Name?.rich_text?.[0]?.plain_text || '',
      pageContent: pageContent.trim(),
    }
  } catch (error) {
    console.error('Error fetching guest data from Notion:', error)
    return null
  }
}

// Helper function to get all possible column names from your database
export async function getDatabaseSchema() {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!,
    })
    
    console.log('Database properties:', Object.keys(response.properties))
    return response.properties
  } catch (error) {
    console.error('Error fetching database schema:', error)
    return null
  }
} 