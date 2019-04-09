import * as moment from 'moment'

export const toHoursAndMinutes = seconds => {
  if (!seconds) {
    return { h: undefined, m: undefined }
  }
  const d = moment.duration({ seconds })
  const m = d.minutes()
  d.subtract(m, 'minutes')
  const h = d.asHours()
  return { h, m }
}
