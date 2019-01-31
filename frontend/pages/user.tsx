import React from 'react'
import Link from 'next/link'
import { Button, Col, Row } from 'reactstrap'
import {
  Layout,
  Navbar,
  ProfilePicture,
  ProfileHeader,
  ProfileNav
} from '../components'
import Head from 'next/head'
//import { User as UserModel } from '../models'
import { RecipeCard } from '../components/RecipeCard'

const recipes = [
  {
    name: 'Pizza',
    slug: 'pizza',
    image: 'http://insidetailgating.com/wp-content/uploads/2015/05/pizza.jpg'
  },
  {
    name: 'Pancakes',
    slug: 'pancakes',
    image:
      'http://www.pamelasproducts.com/wp-content/uploads/2012/05/Pancakes.png'
  },
  {
    name: 'Egg Salad',
    slug: 'egg-salad',
    image:
      'https://www.afamilyfeast.com/wp-content/uploads/2013/03/egg_salad1.jpg'
  },
  {
    name: 'Chicken Caesar Pasta',
    slug: 'chicken-caesar-pasta',
    image:
      'https://spicysouthernkitchen.com/wp-content/uploads/caesar-pasta-salad-5.jpg'
  },
  {
    name: 'Chicken Pesto Parmesan',
    slug: 'chicken-pesto-parmesan',
    image:
      'https://www.melaniecooks.com/wp-content/uploads/2017/12/chicken_baked_pesto_recipe-773x1030.jpg'
  }
]

interface UserProps {
  user: any
}

const ListRecipes = props => (
  <Row>
    {props.recipes.map(r => (
      <Col xs="12" md="4" xl="3" key={r.slug} className="mt-3">
        <RecipeCard {...r} username={props.username} />
      </Col>
    ))}
  </Row>
)

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ req, query }) {
    const username = query.username
    if (req) {
      //const models = require('../models')
      //console.log('have req so we are on the server')
      //const user = await models.User.findOne({ where: { username }})
    }
    return { user: { username } }
  }

  public render() {
    console.log(this.props)
    return (
      <Layout>
        <Head>
          <title>{this.props.user.username}</title>
        </Head>
        <ProfileHeader {...this.props.user} />
        <ProfileNav username={this.props.user.username} />
        <ListRecipes recipes={recipes} username={this.props.user.username} />
      </Layout>
    )
  }
}
