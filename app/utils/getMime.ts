export const getBase64Mime = (base64String: string) => {
  const regex = /^data:(.+);base64,/
  const exec = regex.exec(base64String)
  if (!exec) {
    throw new Error('file validation failed')
  }
  return exec[1]
}
