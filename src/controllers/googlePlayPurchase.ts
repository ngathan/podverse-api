import { getRepository } from 'typeorm'
import { GooglePlayPurchase } from '~/entities'
import { validateClassOrThrow } from '~/lib/errors'
const createError = require('http-errors')

const createGooglePlayPurchase = async (obj) => {
  const repository = getRepository(GooglePlayPurchase)
  const googlePlayPurchase = new GooglePlayPurchase()
  const newGooglePlayPurchase = Object.assign(googlePlayPurchase, obj)
  await validateClassOrThrow(newGooglePlayPurchase)
  await repository.save(newGooglePlayPurchase)
  return newGooglePlayPurchase
}

const getGooglePlayPurchase = async (orderId, loggedInUserId) => {
  const repository = getRepository(GooglePlayPurchase)

  if (!loggedInUserId) {
    throw new createError.Unauthorized('Login to get PayPalOrder by id')
  }

  const googlePlayPurchase = await repository.findOne(
    { orderId },
    { relations: ['owner'] }
  )

  if (!googlePlayPurchase) {
    return null
  }

  if (googlePlayPurchase.owner.id === loggedInUserId) {
    return googlePlayPurchase
  } else {
    throw new createError.Unauthorized(`You don't have permission to get this Google Play purchase by id`)
  }
}

const updateGooglePlayPurchase = async (obj, loggedInUserId) => {
  const repository = getRepository(GooglePlayPurchase)
  const googlePlayPurchase = await repository.findOne(
    { orderId: obj.orderId },
    { relations: ['owner'] }
  )

  if (!googlePlayPurchase) {
    throw new createError.NotFound('GooglePlayPurchase not found')
  }

  if (googlePlayPurchase.owner && googlePlayPurchase.owner.id !== loggedInUserId) {
    throw new createError.Unauthorized('Unauthorized')
  }

  const newGooglePlayPurchase = Object.assign(googlePlayPurchase, obj)
  await validateClassOrThrow(newGooglePlayPurchase)
  await repository.save(newGooglePlayPurchase)
  return newGooglePlayPurchase
}

export {
  createGooglePlayPurchase,
  getGooglePlayPurchase,
  updateGooglePlayPurchase
}