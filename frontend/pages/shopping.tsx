import * as React from 'react'
import * as _ from 'lodash'
import ErrorPage from './_error'
import Head from 'next/head'
import {
  Blankslate,
  Layout,
  ShoppingLists as Shopping,
  ShoppingList
} from '../components'
import { Button, Row, Col } from 'reactstrap'
import { api } from '../common/http'
import { ShoppingListJSON, ShoppingListItemJSON, UserJSON } from '../models'
import { withRouter, WithRouterProps } from 'next/router'
import { withUUID } from '../common/uuid'
import { v4 as uuid } from 'uuid'

interface ShoppingListsProps {
  id?: number
  user: UserJSON
  lists: { [id: number]: ShoppingListJSON }
  active?: ShoppingListJSON
  statusCode?: number
}

interface ShoppingListsState {
  active: ShoppingListJSON
  lists: { [id: number]: ShoppingListJSON }
}

const getShoppingList = (id: number) =>
  api.getShoppingList(id).then(list => {
    const { items } = list
    list.items = items.map(withUUID)
    return list
  })

class ShoppingLists extends React.Component<
  ShoppingListsProps & WithRouterProps,
  ShoppingListsState
> {
  constructor(props: ShoppingListsProps) {
    super(props)
    this.state = {
      active: props.active,
      lists: props.lists
    }
  }

  static async getInitialProps({ query, res }) {
    const { id } = query
    try {
      const user = await api.getCurrentUser()
      const shoppingLists = await api.getShoppingLists()
      const lists = _.keyBy(shoppingLists, 'id')
      const activeId = id || _.first(_.map(shoppingLists, 'id'))
      const active = activeId ? await getShoppingList(activeId) : undefined
      return {
        id,
        active,
        lists,
        user
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public async componentDidUpdate(prevProps) {
    let {
      query: { id }
    } = this.props.router
    id = _.isArray(id) ? _.first(id) : id
    if (id && id !== prevProps.router.query.id) {
      this.setState({
        active: await getShoppingList(_.toNumber(id))
      })
    }
  }

  public addList = async () => {
    const name = prompt('New List Name')
    if (!name) {
      return
    }
    const list = await api.createShoppingList(name)
    this.setState(s => ({
      lists: {
        ...s.lists,
        [list.id]: list
      },
      active: list
    }))
  }

  public onAdd = async (list: ShoppingListJSON) => {
    const name = prompt(`Add to ${list.name}`)
    if (!name) {
      return
    }
    const item = await api.createShoppingListItem(list.id, name)
    item._uuid = uuid()
    this.setState(s => ({
      active: {
        ...s.active,
        items: [...s.active.items, item]
      }
    }))
  }

  public onChange = async (
    list: ShoppingListJSON,
    item: ShoppingListItemJSON
  ) => {
    this.setState(
      s => ({
        active: {
          ...s.active,
          items: s.active.items.map(i => ({
            ...i,
            ...(i._uuid === item._uuid ? item : {})
          }))
        }
      }),
      async () => {
        await api.patchShoppingListItem(list.id, item.id, {
          completed: item.completed
        })
      }
    )
  }

  public onRemove = async (
    list: ShoppingListJSON,
    item: ShoppingListItemJSON
  ) => {
    this.setState(
      s => ({
        active: {
          ...s.active,
          items: _.filter(s.active.items, i => i._uuid != item._uuid)
        }
      }),
      async () => {
        await api.deleteShoppingListItem(list.id, item.id)
      }
    )
  }

  public render() {
    const { id, statusCode } = this.props
    const { active, lists } = this.state
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <Layout title={id ? _.get(active, 'name', 'Shopping') : 'Shopping'}>
        <Head>
          <title>Shopping Lists - PlateZero</title>
        </Head>
        {_.size(lists) === 0 && (
          <Row className="mt-1">
            <Col xs="12">
              <Blankslate>
                <h2>No Shopping Lists</h2>
                <Button color="primary" onClick={this.addList}>
                  Create List
                </Button>
              </Blankslate>
            </Col>
          </Row>
        )}
        {_.size(lists) > 0 && (
          <Row className="mt-1">
            <Col
              className={id ? 'd-none d-md-block' : ''}
              xs="12"
              md="4"
              lg="3"
            >
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="mb-0">Lists</h2>
                <Button className="pr-0" color="link" onClick={this.addList}>
                  <i className="far fa-plus" />
                </Button>
              </div>
              <Shopping lists={_.values(lists)} />
            </Col>
            <Col
              className={!id ? 'd-none d-md-block' : ''}
              xs="12"
              md="8"
              lg="9"
            >
              <ShoppingList
                list={active}
                onAdd={this.onAdd}
                onChange={this.onChange}
                onRemove={this.onRemove}
              />
            </Col>
          </Row>
        )}
      </Layout>
    )
  }
}

export default withRouter(ShoppingLists)
