import React from 'react'
import * as moment from 'moment'

interface TimestampProps {
  t: string | moment.Moment
}

const ensureMoment = (t: string | moment.Moment): moment.Moment =>
  moment.isMoment(t) ? t : moment(t)

const humanize = (t: moment.Moment): string =>
  t.format('dddd MMMM Do YYYY h:mm:ss a')

export const Timestamp = (props: TimestampProps) => {
  const t = ensureMoment(props.t)
  return <span title={humanize(t)}>{t.fromNow()}</span>
}
