import { randomUUID } from 'crypto'

export const createUniqueId = (length = 10) => {
  const uuid = randomUUID().replace(/-/g, '')
  const { floor, random } = Math

  let id = ''
  for (let i = 0; i < length; i++) {
    id += uuid.charAt(floor(random() * uuid.length))
  }

  return id
}
