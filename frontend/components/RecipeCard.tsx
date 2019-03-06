import React from 'react'
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap'
const {
  routes: { Link }
} = require('../routes')

export interface RecipeCardProps {
  title: string
  slug: string
  image_url?: string
  username: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <Link route={`/${props.username}/${props.slug}`}>
    <a>
      <Card>
        {props.image_url && (
          <CardImg
            top
            width="100%"
            src={props.image_url}
            alt="Card image cap"
            style={{ height: 180, objectFit: 'cover' }}
          />
        )}
        <CardBody className="p-3">
          <CardTitle className="m-0">
            <strong>{props.title}</strong>
          </CardTitle>
          <style jsx>{`
            strong {
              color: black;
            }
            a:hover {
              text-decoration: none;
            }
          `}</style>
        </CardBody>
      </Card>
    </a>
  </Link>
)
