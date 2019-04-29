import React from 'react'
import * as _ from 'lodash'
import * as parseUrl from 'url-parse'
import { Row, Col } from 'reactstrap'
import { RecipeVersionJSON, RecipeJSON } from '../models'
import { toHoursAndMinutes } from '../common/time'
import { Preheat } from './Preheats'
import { getName } from '../common/model-helpers'
import { Link } from '../routes'

const RecipeVersionHeaderNoImage = ({
  version
}: {
  version: RecipeVersionJSON
}) => {
  const title = version.recipe.title
  const subtitle = version.recipe.subtitle
  const author = version.author
  return (
    <Col xs="12" className="my-3">
      <h1 className="mb-0">{title}</h1>
      <h5 className="m-0">{subtitle}</h5>
      <Link to="user" params={{ username: author.username }}>
        <a itemProp="author">{getName(version.author)} </a>
      </Link>
      <Source version={version} />
      <ul className="mb-0 mt-3 list-unstyled">
        <li>
          <span className="font-weight-bold">Yield</span> {recipeYield(version)}
        </li>
        <li>
          <span className="font-weight-bold">Time</span> {duration(version)}
        </li>
      </ul>
    </Col>
  )
}

const RecipeVersionHeaderImage = ({
  version
}: {
  version: RecipeVersionJSON
}) => {
  const title = version.recipe.title
  const subtitle = version.recipe.subtitle
  const author = version.author
  const imageUrl = version.recipe.image_url
  return (
    <Col xs="12" className="px-0 px-sm-3">
      <div className="position-relative">
        <img
          className="w-100 d-print-none"
          src={imageUrl}
          itemProp="image"
          alt={`Picture of ${title}`}
        />
        <div
          className="position-absolute text-white w-100 p-2 pt-5"
          style={{
            bottom: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,.70))'
          }}
        >
          <h1 className="m-0">{title}</h1>
          <h5>{subtitle}</h5>
          <a
            href={`/${author.username}`}
            style={{ textDecoration: 'underline' }}
            itemProp="author"
            className="text-white"
          >
            {getName(author)}
          </a>{' '}
          <Source version={version} className="text-white" />
          <div className="mt-3 stats d-flex">
            <Col
              xs="6"
              className="align-items-center d-flex justify-content-center text-center"
            >
              {recipeYield(version)}
            </Col>
            <Col
              xs="6"
              className="align-items-center d-flex justify-content-center text-center"
              style={{ borderLeft: '1px solid #ccc;' }}
            >
              {duration(version)}
            </Col>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          h1,
          h5 {
            text-shadow: 0 1px 0 black;
          }

          img[itemProp='image'] {
            height: 500px;
            object-fit: cover;
          }
        `}
      </style>
    </Col>
  )
}

export const RecipeVersionHeader = ({
  version
}: {
  version: RecipeVersionJSON
}) => {
  const imageUrl = version.recipe.image_url
  return imageUrl ? (
    <RecipeVersionHeaderImage version={version} />
  ) : (
    <RecipeVersionHeaderNoImage version={version} />
  )
}

interface Props {
  recipeVersion: RecipeVersionJSON
}
export const RecipeVersionVitals = (props: Props) => {
  const vitals = _.flatten(
    _.map([duration, recipeYield, source, preheats], visit =>
      visit(props.recipeVersion)
    )
  )
  if (!vitals.length) {
    return null
  }
  return (
    <ul className="list-inline">
      {vitals.map((vital, idx) => (
        <li className="list-inline-item text-muted" key={idx}>
          {vital}
        </li>
      ))}
    </ul>
  )
}

const Preheats = (rv: RecipeVersionJSON) =>
  _.map(rv.preheats, preheat => <Preheat preheat={preheat} />)

const duration = (rv: RecipeVersionJSON) => {
  const d = _.get(rv, 'recipeDuration.duration_seconds')
  if (!d) {
    return []
  }
  return (
    <time itemProp="cookTime" dateTime={`PT${d}S`}>
      {formatDuration(d)}
    </time>
  )
}

const recipeYield = (rv: RecipeVersionJSON) => {
  let y = _.get(rv, 'recipeYield.text')
  if (!y) {
    return null
  }
  return <span itemProp="recipeYield">{y}</span>
}

const Source = ({
  version,
  className
}: {
  version: RecipeVersionJSON
  className?: string
}) => {
  const work = getWorkTitle(version.recipe)
  if (!work) {
    return []
  }
  const link = getLink(version.recipe)
  const src = link ? (
    <a
      href={link}
      target="_blank"
      itemProp="isBasedOn"
      className={className || ''}
    >
      {work}
    </a>
  ) : (
    <span itemProp="isBasedOn">{work}</span>
  )
  return <>from {src}</>
}

const formatDuration = (seconds: number) => {
  const { h, m } = toHoursAndMinutes(seconds)
  const hs = `${h} ${h > 1 ? 'hours' : 'hour'}`
  const ms = `${m} ${m > 1 ? 'minutes' : 'minute'}`
  if (h > 0) {
    return m !== 0 ? `${hs} ${ms}` : hs
  }
  return ms
}

// piece together the full display of the work, either "[work] by [author]", or
// if only one of the two is provided then "[work]" or "[author]" respectively.
// if neither is present, than we'll just get undefined.
function getWorkTitle(recipe: RecipeJSON) {
  const { source_url, source_title, source_author } = recipe
  if (source_title && source_author) {
    return `${source_title} by ${source_author}`
  }
  if (source_title) {
    return source_title
  }
  if (source_author) {
    return source_author
  }
  if (source_url) {
    return parseUrl(source_url).hostname
  }
  return undefined
}

// if the recipe has a source url, return that. otherwise, if it has a source
// isbn, return a link to a duckduckgo search for the isbn. otherwise, simply
// return nothing
function getLink(recipe: RecipeJSON) {
  const { source_url, source_isbn } = recipe
  if (source_url) {
    return source_url
  }
  if (source_isbn) {
    return `https://duck.com/?q=${encodeURIComponent('isbn ' + source_isbn)}`
  }
  return undefined
}
