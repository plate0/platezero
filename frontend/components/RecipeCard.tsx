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
    <div
      className="rounded shadow-sm"
      style={{
        height: 180,
        width: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: props.image_url ? 'transparent' : 'var(--primary)',
        backgroundImage: `url(${props.image_url ||
          '/static/recipe-placeholder-md.jpg'})`,
        backgroundBlendMode: 'luminosity'
      }}
    />
    <div className="pt-1">
      <div className="m-0">
        <Link route={`/${props.username}/${props.slug}`}>
          <a className="text-dark stretched-link font-weight-bold">
            {props.title}
          </a>
        </Link>
      </div>
    </div>
  </div>
)
