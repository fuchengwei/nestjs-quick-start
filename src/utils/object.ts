export const pick = <T, K extends keyof T>(object: T, fields: K[]) => {
  const result = {} as Pick<T, K>

  fields.forEach((field) => {
    result[field] = object[field]
  })

  return result
}

export const omit = <T, K extends keyof T>(object: T, fields: K[]): Omit<T, K> => {
  const result = structuredClone(object)

  fields.forEach((field) => {
    delete result[field]
  })

  return result
}
