type ApiResponse<T> ={
     success: boolean
     message?: string
     data?: T
     pagination?: {
       page: number
       limit: number
       total: number
       totalPages: number
     }
}
export default ApiResponse