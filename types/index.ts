export type ComplaintStatus = 'pending' | 'in_review' | 'resolved' | 'dismissed'
export type ComplaintCategory = 'infrastructure' | 'noise' | 'safety' | 'sanitation' | 'environment' | 'other'
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Complaint {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  status: ComplaintStatus
  location: string
  submitter_name: string
  submitter_email: string
  is_anonymous: boolean
  upvotes: number
  admin_notes?: string
  resolved_at?: string
  image_url?: string
  tracking_id: string
}

export interface ComplaintInsert {
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  location: string
  submitter_name: string
  submitter_email: string
  is_anonymous: boolean
  image_url?: string
}

export interface Database {
  public: {
    Tables: {
      complaints: {
        Row: Complaint
        Insert: ComplaintInsert
        Update: Partial<Complaint>
      }
    }
  }
}

export interface StatsData {
  total: number
  pending: number
  in_review: number
  resolved: number
  dismissed: number
  by_category: Record<ComplaintCategory, number>
}
