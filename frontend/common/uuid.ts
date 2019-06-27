import { v4 as uuid } from 'uuid/v4'

export const withUUID = (o: object) => ({
  ...o,
  _uuid: uuid()
})
