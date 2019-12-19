import v4 from 'uuid/v4'

export const withUUID = (o: object) => ({
  ...o,
  _uuid: v4()
})
