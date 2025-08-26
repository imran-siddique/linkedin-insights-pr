import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility functions for constructing LinkedIn profile section URLs
 */
export function getLinkedInSectionUrl(profileUrl: string, section?: 'followers' | 'following' | 'recent-activity' | 'connections'): string {
  if (!profileUrl) return ''
  
  // Ensure the URL ends without a trailing slash
  const baseUrl = profileUrl.replace(/\/$/, '')
  
  if (!section) return baseUrl
  
  switch (section) {
    case 'followers':
      return `${baseUrl}/followers/`
    case 'following':
      return `${baseUrl}/following/`
    case 'recent-activity':
      return `${baseUrl}/recent-activity/`
    case 'connections':
      // Note: LinkedIn doesn't allow viewing others' connections publicly
      return baseUrl
    default:
      return baseUrl
  }
}