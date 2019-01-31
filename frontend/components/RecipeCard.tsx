import React from 'react'
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap'
import { Recipe } from '../models'
const {
  routes: { Link }
} = require('../routes')

export interface RecipeCardProps {
  name: string
  slug: string
  image?: string
  username: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <Link route={`/${props.username}/recipe/${props.slug}`}>
    <a>
      <Card>
        <CardImg
          top
          width="100%"
          src={props.image}
          alt="Card image cap"
          style={{ height: 180, objectFit: 'cover' }}
        />
        <CardBody className="p-3">
          <CardTitle className="m-0">
            <strong>{props.name}</strong>
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
