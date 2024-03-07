export const asyncReplace = async (
  text: string,
  regex: RegExp,
  replacementFn: (text: string) => Promise<string>
) => {
  const replacementPromises: Promise<string>[] = []
  text.replace(regex, (str: string, p: string) => {
    replacementPromises.push(replacementFn(p))
    return str
  })
  const replacements = await Promise.all(replacementPromises)
  return text.replace(regex, replacements.shift() as string)
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
