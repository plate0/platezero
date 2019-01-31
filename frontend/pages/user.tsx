import React from 'react'
import Link from 'next/link'
import { Button, Col, Row } from 'reactstrap'
import { Layout, Navbar, ProfilePicture } from '../components'
import Head from 'next/head'
import { User as UserModel } from '../models'
import { RecipeCard } from '../components/RecipeCard'

const user = {
  username: 'em',
  avatar: 'https://github.com/ethanmick.png?size=128'
}

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
  user: UserModel
}

const ProfileHeader = (user: any) => (
  <Row className="mt-3 d-flex justify-content-center">
    <Col xs={{ size: 'auto' }} className="text-center">
      <ProfilePicture size={128} img={user.avatar} />
      <h3>{user.username}</h3>
    </Col>
  </Row>
)

const ProfileNav = (user: any) => (
  <Row className="d-flex justify-content-around py-3 border-bottom">
    <Col xs="2">
      <Link href={`/${user.username}/recipes`}>
        <a>Recipes</a>
      </Link>
    </Col>
    <Col xs="2">Tares</Col>
  </Row>
)

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
  static async getInitialProps({ query }) {
    return { user }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.user.username}</title>
        </Head>
        <ProfileHeader {...user} />
        <ProfileNav {...user} />
        <ListRecipes recipes={recipes} username={this.props.user.username} />
      </Layout>
    )
  }
}
