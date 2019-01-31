import React from 'react'
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap'
import { Recipe } from '../models'

export interface RecipeCardProps {
  name: string
  slug: string
  image?: string
}

export const RecipeCard = (props: RecipeCardProps) => (
  <Card>
    <CardImg top width="100%" src="" alt="Card image cap" />
    <CardBody>
      <CardTitle>Card title</CardTitle>
    </CardBody>
  </Card>
)
