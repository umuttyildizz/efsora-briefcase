export interface User {
  id: string
  email: string
}

export interface Note {
  id: string
  title: string | null
  content: string
  summary: string | null
  tags: string[]
  created_at: string
  user_id: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  error: string
}