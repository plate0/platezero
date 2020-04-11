import v4 from 'uuid/v4'

export const withUUID = <T>(o: T): T => ({
  ...o,
  _uuid: v4()
})
