import Link from 'next/link'
import React from 'react'
import { Col } from 'reactstrap'
import parseUrl from 'url-parse'
import { getName } from '../common/model-helpers'
import { RecipeJSON } from '../models'
import { Image } from './Image'

const RecipeHeaderNoImage = ({ recipe }: { recipe: RecipeJSON }) => {
  const title = recipe.title
  const subtitle = recipe.subtitle
  return (
    <Col xs="12" className="my-3">
      <h1 className="mb-0">{title}</h1>
      <h5 className="m-0">{subtitle}</h5>
      <Link href={{ href: 'user', query: { username: recipe.owner.username } }}>
        <a itemProp="author">{getName(recipe.owner)} </a>
      </Link>
      <Source recipe={recipe} />
    </Col>
  )
}

const RecipeHeaderImage = ({
  recipe,
  condensed
}: {
  recipe: RecipeJSON
  condensed: boolean
}) => {
  const title = recipe.title
  const subtitle = recipe.subtitle
  const imageUrl = recipe.image_url
  return (
    <Col xs="12" className="px-0 px-sm-3 d-print-none">
      <div className="position-relative">
        <Image
          height={condensed ? '250' : '500'}
          className="w-100 d-print-none"
          itemProp="image"
          alt={`Picture of ${title}`}
          style={{ objectFit: 'cover' }}
          src={imageUrl}
          proxy="r360"
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
            href={`/${recipe.owner.username}`}
            style={{ textDecoration: 'underline' }}
            itemProp="author"
            className="text-white"
          >
            {getName(recipe.owner)}
          </a>{' '}
          <Source recipe={recipe} className="text-white text-underline" />
        </div>
      </div>
      <style jsx>
        {`
          h1,
          h5 {
            text-shadow: 0 1px 0 black;
          }
        `}
      </style>
    </Col>
  )
}

export const RecipeHeader = ({
  recipe,
  condensed
}: {
  recipe: RecipeJSON
  condensed: boolean
}) => {
  const imageUrl = recipe.image_url
  return imageUrl ? (
    <>
      <div className="d-none d-print-block">
        <RecipeHeaderNoImage recipe={recipe} />
      </div>
      <RecipeHeaderImage recipe={recipe} condensed={condensed} />
    </>
  ) : (
    <RecipeHeaderNoImage recipe={recipe} />
  )
}

const Source = ({
  recipe,
  className
}: {
  recipe: RecipeJSON
  className?: string
}) => {
  const work = getWorkTitle(recipe)
  if (!work) {
    return null
  }
  const link = getLink(recipe)
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
  return (
    <>
      <span className="mx-2">&#8226;</span>
      {src}
    </>
  )
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
