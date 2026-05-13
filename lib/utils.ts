import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'CC-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const categoryLabels: Record<ComplaintCategory, string> = {
  infrastructure: 'Infrastructure',
  noise: 'Noise Disturbance',
  safety: 'Public Safety',
  sanitation: 'Sanitation',
  environment: 'Environment',
  other: 'Other',
}

export const categoryIcons: Record<ComplaintCategory, string> = {
  infrastructure: '🏗️',
  noise: '🔊',
  safety: '⚠️',
  sanitation: '🗑️',
  environment: '🌿',
  other: '📋',
}

export const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pending Review',
  in_review: 'Under Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

export const statusColors: Record<ComplaintStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  in_review: 'bg-blue-100 text-blue-800 border-blue-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
  dismissed: 'bg-gray-100 text-gray-600 border-gray-300',
}

export const priorityLabels: Record<ComplaintPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const priorityColors: Record<ComplaintPriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}
