import moment from 'moment'
import React from 'react'

interface TimestampProps {
  t: string | moment.Moment | Date
  itemProp?: string
}

const ensureMoment = (t: string | moment.Moment | Date): moment.Moment =>
  moment.isMoment(t) ? t : moment(t)

export const humanize = (t: moment.Moment): string =>
  t.format('dddd MMMM Do YYYY h:mm:ss a')

export const Timestamp = (props: TimestampProps) => {
  const t = ensureMoment(props.t)
  return (
    <time itemProp={props.itemProp} title={humanize(t)} dateTime={t.format()}>
      {t.fromNow()}
    </time>
  )
}
