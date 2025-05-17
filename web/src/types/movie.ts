export interface Movie {
  id: string
  title: string
  originalTitle?: string
  year: number
  description: string
  poster: string
  backdrop: string
  rating: number
  categories: string[]
}

export interface MovieCategory {
  id: string
  name: string
}

export interface Comment {
  id: string
  movieId: string
  userId: string
  username: string
  content: string
  date: string
}

export interface Rating {
  movieId: string
  userId: string
  rating: number
  date: string
}