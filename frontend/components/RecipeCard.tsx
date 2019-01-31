import React from 'react'
import Link from 'next/link'
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap'
import { Recipe } from '../models'

export interface RecipeCardProps {
  name: string
  slug: string
  image?: string
  username: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <Link href={`/${props.username}/recipe/${props.slug}`}>
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
        </CardBody>
      </Card>
    </a>
  </Link>
)
