import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export interface GuestData {
  id: string
  name: string
  pageContent?: string
  recordingDate?: string
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
    
    // Extract recording date from properties
    let recordingDate: string | undefined
    if (pageProperties['Recording Date'] && pageProperties['Recording Date'].date) {
      recordingDate = pageProperties['Recording Date'].date.start
    }
    
    // Fetch the page content using block children
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
    })

    // Extract text content from all blocks
    let pageContent = ''
    let inQuestionsSection = false
    let questionsContent = ''
    let numberedListCounter = 1
    
    for (const block of blocksResponse.results) {
      let blockText = ''
      let blockType = ''
      
      if (block.type === 'paragraph') {
        if (block.paragraph.rich_text.length > 0) {
          blockText = block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        } else {
          // Empty paragraph - add spacing
          blockText = '\n'
        }
        blockType = 'paragraph'
        numberedListCounter = 1 // Reset counter for new section
      } else if (block.type === 'heading_1' && block.heading_1.rich_text.length > 0) {
        blockText = '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'heading_1'
        numberedListCounter = 1
      } else if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
        blockText = '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'heading_2'
        numberedListCounter = 1
      } else if (block.type === 'heading_3' && block.heading_3.rich_text.length > 0) {
        blockText = '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'heading_3'
        numberedListCounter = 1
      } else if (block.type === 'bulleted_list_item' && block.bulleted_list_item.rich_text.length > 0) {
        blockText = '• ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n'
        blockType = 'bulleted_list_item'
      } else if (block.type === 'numbered_list_item' && block.numbered_list_item.rich_text.length > 0) {
        blockText = numberedListCounter + '. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n'
        
        // Fetch children if this numbered list item has them
        if (block.has_children) {
          try {
            const childrenResponse = await notion.blocks.children.list({
              block_id: block.id,
            })
            
            // Add sub-items with letters
            let subCounter = 97 // ASCII for 'a'
            for (const child of childrenResponse.results) {
              if (child.type === 'numbered_list_item' && child.numbered_list_item.rich_text.length > 0) {
                const subText = child.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')
                blockText += '  ' + String.fromCharCode(subCounter) + '. ' + subText + '\n'
                
                // Fetch third-level children if this child has them
                if (child.has_children) {
                  try {
                    const grandChildrenResponse = await notion.blocks.children.list({
                      block_id: child.id,
                    })
                    
                    // Add third-level items with roman numerals
                    let grandChildCounter = 1
                    for (const grandChild of grandChildrenResponse.results) {
                      if (grandChild.type === 'numbered_list_item' && grandChild.numbered_list_item.rich_text.length > 0) {
                        const grandChildText = grandChild.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')
                        blockText += '    ' + grandChildCounter + '. ' + grandChildText + '\n'
                        grandChildCounter++
                      }
                    }
                  } catch (error) {
                    console.error('Error fetching grandchildren:', error)
                  }
                }
                
                subCounter++
              }
            }
          } catch (error) {
            console.error('Error fetching children:', error)
          }
        }
        
        numberedListCounter++
        blockType = 'numbered_list_item'
      } else if (block.type === 'to_do' && block.to_do.rich_text.length > 0) {
        // Handle to-do items which might be used for sub-lists
        const checkbox = block.to_do.checked ? '☑ ' : '☐ '
        blockText = '  ' + checkbox + block.to_do.rich_text.map((text: any) => text.plain_text).join('') + '\n'
        blockType = 'to_do'
      } else if (block.type === 'quote' && block.quote.rich_text.length > 0) {
        blockText = '> ' + block.quote.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'quote'
      } else if (block.type === 'toggle' && block.toggle.rich_text.length > 0) {
        blockText = block.toggle.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'toggle'
      } else if (block.type === 'callout' && block.callout.rich_text.length > 0) {
        blockText = block.callout.rich_text.map((text: any) => text.plain_text).join('') + '\n\n'
        blockType = 'callout'
      }
      
      // Check if this block starts the topic section
      if ((blockType === 'heading_1' || blockType === 'heading_2' || blockType === 'heading_3') && blockText.toLowerCase().includes('#') && blockText.toLowerCase().includes('topic')) {
        inQuestionsSection = true
        continue // Skip the "Topic" header itself
      }
      
      // Check if this block contains "pre-recording" (case insensitive)
      if (blockText.toLowerCase().includes('pre-recording')) {
        break // Stop at pre-recording section
      }
      
      // If we're in the topic section, add the content
      if (inQuestionsSection) {
        questionsContent += blockText
      }
      
      // If no topic section was found, collect all content until pre-recording
      if (!inQuestionsSection && blockText.trim() !== '') {
        questionsContent += blockText
      }
    }

    pageContent = questionsContent.trim()

    return {
      id: pageId,
      name: pageProperties.Name?.title?.[0]?.plain_text || pageProperties.Name?.rich_text?.[0]?.plain_text || '',
      pageContent: pageContent.trim(),
      recordingDate: recordingDate,
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