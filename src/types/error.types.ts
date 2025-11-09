export type APIError = {
  error: string
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}
