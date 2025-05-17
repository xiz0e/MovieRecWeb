import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'
import type { Movie, MovieCategory, Comment } from '../types/movie'

export const useMoviesStore = defineStore('movies', () => {
  const allMovies = ref<Movie[]>([])
  const popularMovies = ref<Movie[]>([])
  const categories = ref<MovieCategory[]>([])
  const recommendations = ref<Movie[]>([])
  const ratingHistory = ref<{movieId: string, rating: number, date: string}[]>([])
  const isLoading = ref(false)
  const error = ref('')
  
  // Search movies
  const searchMovies = async (query: string) => {
    // Search in allMovies if they're already loaded
    if (allMovies.value.length > 0) {
      const normalizedQuery = query.toLowerCase()
      return allMovies.value.filter(movie => 
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.originalTitle?.toLowerCase().includes(normalizedQuery) ||
        movie.description.toLowerCase().includes(normalizedQuery)
      )
    }
    
    // If movies aren't loaded yet, fetch them first
    await fetchMovies()
    
    // Then perform the search
    const normalizedQuery = query.toLowerCase()
    return allMovies.value.filter(movie => 
      movie.title.toLowerCase().includes(normalizedQuery) ||
      movie.originalTitle?.toLowerCase().includes(normalizedQuery) ||
      movie.description.toLowerCase().includes(normalizedQuery)
    )
  }
  
  // Fetch movies list
  const fetchMovies = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get('/movies')
      allMovies.value = response.data
      
      return true
    } catch (err) {
      error.value = '获取电影列表失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch popular movies
  const fetchPopularMovies = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get('/movies/popular')
      popularMovies.value = response.data
      
      return true
    } catch (err) {
      error.value = '获取热门电影失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch movie categories
  const fetchCategories = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get('/categories')
      categories.value = response.data
      
      return true
    } catch (err) {
      error.value = '获取电影分类失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch movies by category
  const fetchMoviesByCategory = async (categoryId: string) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get(`/categories/${categoryId}/movies`)
      return response.data
    } catch (err) {
      error.value = '获取分类电影失败'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Get movie by ID
  const getMovie = async (id: string) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get(`/movies/${id}`)
      return response.data
    } catch (err) {
      error.value = '获取电影详情失败'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch personalized recommendations
  const fetchRecommendations = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get('/recommendations')
      recommendations.value = response.data
      
      return true
    } catch (err) {
      error.value = '获取推荐电影失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Rate a movie
  const rateMovie = async (movieId: string, rating: number) => {
    try {
      isLoading.value = true
      error.value = ''
      
      await api.post('/ratings', { movieId, rating })
      
      // Update rating history
      await fetchRatingHistory()
      
      return true
    } catch (err) {
      error.value = '评分失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch user's rating history
  const fetchRatingHistory = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get('/ratings/history')
      ratingHistory.value = response.data
      
      return true
    } catch (err) {
      error.value = '获取评分历史失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch comments for a movie
  const fetchComments = async (movieId: string) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.get(`/movies/${movieId}/comments`)
      return response.data
    } catch (err) {
      error.value = '获取评论失败'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Add a comment to a movie
  const addComment = async (comment: Omit<Comment, 'id' | 'date'>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await api.post(`/movies/${comment.movieId}/comments`, comment)
      return response.data
    } catch (err) {
      error.value = '添加评论失败'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    allMovies,
    popularMovies,
    categories,
    recommendations,
    ratingHistory,
    isLoading,
    error,
    searchMovies,
    fetchMovies,
    fetchPopularMovies,
    fetchCategories,
    fetchMoviesByCategory,
    getMovie,
    fetchRecommendations,
    rateMovie,
    fetchRatingHistory,
    fetchComments,
    addComment
  }
})