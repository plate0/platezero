import * as _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import { api } from '../common/http'
import { HttpStatus } from '../common/http-status'
import { UserContext } from '../context/UserContext'

export const FavoriteButton = ({ recipeId }: { recipeId: number }) => {
  const { user } = useContext(UserContext)
  const [favorites, setFavorites] = useState([])
  const [isWorking, setWorking] = useState(false)
  const [isFavorite, setFavorite] = useState(false)

  // when the user changes, update the favorites to reflect that
  useEffect(() => {
    async function fetchFavorites() {
      setFavorites(await api.getFavorites(user.username))
    }
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  // when the list of favorites changes, update the button state to reflect
  // that
  useEffect(() => {
    const isFaved = _.filter(favorites, { recipe_id: recipeId }).length > 0
    setFavorite(isFaved)
  }, [favorites])

  const toggleFavorite = async () => {
    setWorking(true)
    try {
      if (isFavorite) {
        await api.removeFavorite(recipeId)
        setFavorite(false)
      } else {
        await api.addFavorite(recipeId)
        setFavorite(true)
      }
    } catch (err) {
      if (err.statusCode === HttpStatus.Unauthorized) {
        //Router.push('/login')
      }
    } finally {
      setWorking(false)
    }
  }

  return (
    <Button
      disabled={isWorking}
      color={isFavorite ? 'love' : 'outline-love'}
      size="sm"
      className="rounded-circle"
      onClick={toggleFavorite}
      style={{ height: 32, width: 32 }}
    >
      <i className="fal fa-heart" />
    </Button>
  )
}
