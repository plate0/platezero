import React from 'react'
import { Link } from '../routes'

export interface RecipeCardProps {
  title: string
  slug: string
  image_url?: string
  username: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <Link route={`/${props.username}/${props.slug}`}>
    <a>
      <div>
        {props.image_url && (
          <img
            className="rounded shadow-sm"
            width="100%"
            src={props.image_url}
            alt="Card image cap"
            style={{ height: 180, objectFit: 'cover' }}
          />
        )}
        <div className="pt-1">
          <div className="m-0">
            <strong>{props.title}</strong>
          </div>
        </div>
      </div>
      <style jsx>{`
        a:hover {
          text-decoration: none;
        }
        strong {
          color: rgb(62, 62, 62);
        }
      `}</style>
    </a>
  </Link>
)
