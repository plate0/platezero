import React from 'react'
import { Link } from '../routes'

export interface RecipeCardProps {
  title: string
  slug: string
  image_url?: string
  username: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <div>
    <img
      className="rounded"
      style={{ height: 180, width: '100%', objectFit: 'cover' }}
      src={props.image_url || '/static/recipe-placeholder-md.jpg'}
      alt={props.image_url ? `Picture of ${props.title}` : 'Placeholder image'}
    />
    <div className="pt-1">
      <div className="m-0">
        <Link route={`/${props.username}/${props.slug}`}>
          <a className="text-dark stretched-link font-weight-bold overflow-hidden d-block">
            {props.title}
          </a>
        </Link>
      </div>
    </div>
  </div>
)
