export const createEndpoint = (baseUrl: string, endpoint: string) =>
  process.env.NODE_ENV === 'production'
    ? `https://${endpoint}-${baseUrl}`
    : `${baseUrl}/${endpoint}`
