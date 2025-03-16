export default interface User {
  authenticated: boolean
  id: string
  email: string
  type: UserType
  languages: string[]
  jwtToken: string
  streamToken: string
  friendCode: string
}

export enum UserType {
  blind = 'blind',
  volunteer = 'volunteer',
}
