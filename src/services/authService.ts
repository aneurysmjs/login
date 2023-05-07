import axios from 'axios'

// this could in a separate file but I keep it for simplicity sake
const BASE_URL_API = 'https://dummyjson.com'

// just dummy data
export interface User {
  id: number
  username: string
  email: string
  password: string
  lastName: string
  gender: string
  image: string
  token: string
}

export async function login() {
  try {
    const response = await axios.post<User>(`${BASE_URL_API}/auth/login`, {
      // this are hardcoded values in order to make the api to work
      // but I think you understand that we can just put our data given
      // from parameters
      username: 'kminchelle',
      password: '0lelplR',
    })

    return response.data
  }
  catch (error) {
    throw new Error(`Opps, something went wrong, "${(error as Error).message}"`)
  }
}
