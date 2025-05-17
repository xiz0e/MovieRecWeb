export interface User {
  id: string
  username: string
  email: string
  gender?: string
  age?: number
  profession?: string
  avatar?: string
}

export interface UserRegistration {
  username: string
  email: string
  password: string
  gender: string
  age: number
  profession: string
}

export interface UserLoginCredentials {
  email: string
  password: string
}