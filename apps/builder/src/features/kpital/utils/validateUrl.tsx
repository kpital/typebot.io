const urlRegex =
  /^(https?:\/\/)?((localhost:\d{1,5})|([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+))(:\d{1,5})?(\/[^\s]*)?$/

export const validateUrl = (url: string) => urlRegex.test(url)
