import axios from 'axios'

// Base API endpoint (Should point to your Django backend)
const baseURL = 'http://localhost:8000/api'

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock API for development without backend
export const mockApi = {
  // Mock movies data
  movies: [
    {
      id: '1',
      title: '肖申克的救赎',
      originalTitle: 'The Shawshank Redemption',
      year: 1994,
      description: '两个被囚禁在肖申克监狱的男人在数年间找到慰藉和救赎。',
      poster: 'https://image.tmdb.org/t/p/w500/rlEE82K5m03rRZidFKNzCN67xQ2.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      rating: 4.7,
      categories: ['1', '2']
    },
    {
      id: '2',
      title: '教父',
      originalTitle: 'The Godfather',
      year: 1972,
      description: '迈克尔·科莱昂试图摆脱家族犯罪业务，但发现这比他想象的要困难得多。',
      poster: 'https://image.tmdb.org/t/p/w500/y03tzUKvkRCYwJ5NWys4W4bnS9m.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
      rating: 4.5,
      categories: ['1', '3']
    },
    {
      id: '3',
      title: '杰出公民',
      originalTitle: 'El ciudadano ilustre',
      year: 1994,
      description: '一个获得了诺贝尔文学奖的作家，回到阔别已久的家乡，却让一系列的麻烦接踵而至。',
      poster: 'https://image.tmdb.org/t/p/w500/bH63pZizNIJoYCE6kkVoj1lzkK.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/wGMwHYp64UV0vxXdTIIiriDfXxl.jpg',
      rating: 4.6,
      categories: ['1', '3']
    },
    {
      id: '4',
      title: '盗梦空间',
      originalTitle: 'Inception',
      year: 2010,
      description: '一个熟练的窃贼能够进入他人潜意识深处，进行企业间谍活动。',
      poster: 'https://image.tmdb.org/t/p/w500/aBGVsKeDn5gtegkyajPGBHWev25.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
      rating: 4.4,
      categories: ['4', '5']
    },
    {
      id: '5',
      title: '星际穿越',
      originalTitle: 'Interstellar',
      year: 2014,
      description: '一队宇航员通过虫洞旅行，寻找新家园以拯救人类。',
      poster: 'https://image.tmdb.org/t/p/w500/v7Iib57HHgSEI9B7XYRF6qrs11T.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/l33oR0mnvf20avWyIMxW02EtQxn.jpg',
      rating: 4.5,
      categories: ['4', '5']
    },
    {
      id: '6',
      title: '千与千寻',
      originalTitle: 'Spirited Away',
      year: 2001,
      description: '10岁的千寻在搬家途中进入了神灵世界，不得不努力工作来解救变成猪的父母。',
      poster: 'https://image.tmdb.org/t/p/w500/b0c3TgnAqCfDLqzaAG2IoVxw3c4.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/m4TUa2ciEWSlk37rOsjiSIvZDXE.jpg',
      rating: 4.6,
      categories: ['6', '7']
    },
    {
      id: '7',
      title: '这个杀手不太冷',
      originalTitle: 'Léon: The Professional',
      year: 1994,
      description: '12岁女孩玛蒂尔达的家人被警察杀害后，她被杀手莱昂收养。',
      poster: 'https://image.tmdb.org/t/p/w500/jGcGdr049jROZGXS0mD78daypvr.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/bguFhzIGpQdGQ6uizm07oMKbgHi.jpg',
      rating: 4.4,
      categories: ['1', '8']
    },
    {
      id: '8',
      title: '泰坦尼克号',
      originalTitle: 'Titanic',
      year: 1997,
      description: '富家女罗丝与穷画家杰克在1912年命运多舛的泰坦尼克号首航上相爱。',
      poster: 'https://image.tmdb.org/t/p/w500/gi2X1IQHOzm53xUKCm8r1N7zvm8.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w500/sCzcYW9h55WcesOqA12cgEr9Exw.jpg',
      rating: 4.2,
      categories: ['9', '10']
    }
  ],
  
  // Mock categories
  categories: [
    { id: '1', name: '剧情' },
    { id: '2', name: '犯罪' },
    { id: '3', name: '黑帮' },
    { id: '4', name: '科幻' },
    { id: '5', name: '冒险' },
    { id: '6', name: '动画' },
    { id: '7', name: '奇幻' },
    { id: '8', name: '动作' },
    { id: '9', name: '爱情' },
    { id: '10', name: '灾难' }
  ],
  
  // Mock comments
  comments: [
    {
      id: '1',
      movieId: '1',
      userId: '1',
      username: '电影爱好者',
      content: '这部电影太精彩了，每次看都有新的感受，演员的表演令人震撼。',
      date: '2023-10-15T08:30:00Z'
    },
    {
      id: '2',
      movieId: '1',
      userId: '2',
      username: '影评人',
      content: '经典之作，情节设计巧妙，人物塑造深刻，值得反复观看。',
      date: '2023-09-20T14:15:00Z'
    }
  ],
  
  // Mock user
  user: {
    id: '1',
    username: '测试用户',
    email: 'test@example.com',
    gender: '男',
    age: 28,
    profession: 'technician/engineer',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
}

// Use mock API for development (remove this in production)
export const useMockApi = () => {
  // Override axios get method for specific endpoints
  const originalGet = api.get
  api.get = async (url: string) => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (url === '/movies') {
      return { data: mockApi.movies }
    }
    if (url === '/movies/popular') {
      return { data: mockApi.movies.slice(0, 4) }
    }
    if (url === '/categories') {
      return { data: mockApi.categories }
    }
    if (url === '/recommendations') {
      return { data: mockApi.movies.slice(2, 6) }
    }
    if (url.match(/\/movies\/(\d+)$/)) {
      const id = url.split('/').pop()
      const movie = mockApi.movies.find(m => m.id === id)
      return { data: movie || null }
    }
    if (url.match(/\/movies\/(\d+)\/comments$/)) {
      const id = url.match(/\/movies\/(\d+)\/comments$/)![1]
      const comments = mockApi.comments.filter(c => c.movieId === id)
      return { data: comments }
    }
    if (url === '/ratings/history') {
      return { data: [
        { movieId: '1', rating: 4.5, date: '2023-10-01T12:30:00Z' },
        { movieId: '3', rating: 5.0, date: '2023-09-15T18:45:00Z' }
      ] }
    }
    if (url === '/users/me') {
      return { data: mockApi.user }
    }
    if (url.match(/\/categories\/(\d+)\/movies$/)) {
      const id = url.split('/')[2]
      const moviesInCategory = mockApi.movies.filter(m => m.categories.includes(id))
      return { data: moviesInCategory }
    }
    
    return originalGet(url)
  }
  
  // Override axios post method for specific endpoints
  const originalPost = api.post
  api.post = async (url: string, data: any) => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (url === '/login') {
      return { 
        data: { 
          token: 'mock_token_123456',
          user: mockApi.user
        } 
      }
    }
    if (url === '/register') {
      return { 
        data: { 
          token: 'mock_token_123456',
          user: { ...mockApi.user, ...data } 
        } 
      }
    }
    if (url.match(/\/movies\/(\d+)\/comments$/)) {
      const newComment = {
        id: String(mockApi.comments.length + 1),
        date: new Date().toISOString(),
        ...data
      }
      mockApi.comments.push(newComment)
      return { data: newComment }
    }
    if (url === '/ratings') {
      return { data: { success: true } }
    }
    
    return originalPost(url, data)
  }
  
  // Override axios put method for specific endpoints
  const originalPut = api.put
  api.put = async (url: string, data: any) => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (url === '/users/update') {
      return { data: { ...mockApi.user, ...data } }
    }
    
    return originalPut(url, data)
  }
}

// Initialize mock API for development
useMockApi()