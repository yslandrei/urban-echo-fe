export default interface User {
    authenticated: boolean
    id: string
    email: string
    jwtToken: string
    streamToken: string
}