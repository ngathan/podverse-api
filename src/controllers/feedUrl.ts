import { getRepository, In } from 'typeorm'
import { FeedUrl } from '~/entities'
import { validateClassOrThrow } from '~/lib/errors'
const createError = require('http-errors')

const relations = [
  'podcast'
]

const addFeedUrls = async (urls: any[] = []) => {
  const repository = getRepository(FeedUrl)
  const feeds = [] as any

  for (const url of urls) {
    let feedUrl = await repository.findOne({
      where: {
        url
      },
      relations
    })

    if (!feedUrl) {
      feedUrl = new FeedUrl()
      feedUrl.url = url
      feedUrl.isAuthority = true
      await validateClassOrThrow(feedUrl)
      await repository.save(feedUrl)
    }

    if (feedUrl) {
      feeds.push(feedUrl)
    }
  }

  return feeds
}

const deleteFeedUrl = async id => {
  const repository = getRepository(FeedUrl)
  const feedUrl = await repository.findOne({
    where: { id }
  })

  if (!feedUrl) {
    throw new createError.NotFound('FeedUrl not found')
  }

  const result = await repository.remove(feedUrl)
  return result
}

const getFeedUrl = async id => {
  const repository = getRepository(FeedUrl)
  const feedUrl = await repository.findOne({ id }, { relations })

  if (!feedUrl) {
    throw new createError.NotFound('FeedUrl not found')
  }

  return feedUrl
}

const getFeedUrls = (query) => {
  const repository = getRepository(FeedUrl)

  if (query.podcastId) {
    query.podcast = In(query.podcastId)
  }

  return repository.find({
    where: {
      ...query
    },
    relations
  })
}

const updateFeedUrl = async obj => {
  const repository = getRepository(FeedUrl)
  const feedUrl = await repository.findOne({
    where: {
      id: obj.id
    }
  })

  if (!feedUrl) {
    throw new createError.NotFound('FeedUrl not found')
  }

  const newFeedUrl = Object.assign(feedUrl, obj)
  newFeedUrl.podcast = newFeedUrl.podcastId
  delete newFeedUrl.podcastId

  await validateClassOrThrow(newFeedUrl)

  await repository.save(newFeedUrl)
  return newFeedUrl
}

export {
  addFeedUrls,
  deleteFeedUrl,
  getFeedUrl,
  getFeedUrls,
  updateFeedUrl
}
