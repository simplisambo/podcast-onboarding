import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRecordingDate(dateString: string): string {
  // Parse the date as local time to avoid timezone issues
  let recordingDate: Date
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Parse YYYY-MM-DD format as local date
    const [year, month, day] = dateString.split('-').map(Number)
    recordingDate = new Date(year, month - 1, day) // month is 0-indexed
  } else {
    // For other formats, use the default parsing
    recordingDate = new Date(dateString)
  }
  
  const today = new Date()
  
  // Reset time to compare just dates
  const recordingDateOnly = new Date(recordingDate.getFullYear(), recordingDate.getMonth(), recordingDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  
  const diffTime = recordingDateOnly.getTime() - todayOnly.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return "today"
  } else if (diffDays === 1) {
    return "tomorrow"
  } else if (diffDays === -1) {
    return "yesterday"
  } else if (diffDays > 1 && diffDays <= 7) {
    // Within the next week, use day names
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayName = dayNames[recordingDate.getDay()]
    return `this ${dayName}`
  } else if (diffDays > 7 && diffDays <= 14) {
    // Next week
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayName = dayNames[recordingDate.getDay()]
    return `next ${dayName}`
  } else {
    // More than 2 weeks away, use date format
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }
    return recordingDate.toLocaleDateString('en-US', options)
  }
}
