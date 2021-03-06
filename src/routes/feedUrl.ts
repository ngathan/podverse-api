import * as Router from 'koa-router'
import { config } from '~/config'
import { emitRouterError } from '~/lib/errors'
import { getFeedUrl, getFeedUrls } from '~/controllers/feedUrl'
import { parseQueryPageOptions } from '~/middleware/parseQueryPageOptions'
import { validateFeedUrlSearch } from '~/middleware/queryValidation/search'

const router = new Router({ prefix: `${config.apiPrefix}${config.apiVersion}/feedUrl` })

// Search
router.get('/',
  (ctx, next) => parseQueryPageOptions(ctx, next, 'feedUrls'),
  validateFeedUrlSearch,
  async ctx => {
    try {
      const feedUrls = await getFeedUrls(ctx.state.query)
      ctx.body = feedUrls
    } catch (error) {
      emitRouterError(error, ctx)
    }
  }
)

// Get
router.get('/:id',
  async ctx => {
    try {
      const feedUrl = await getFeedUrl(ctx.params.id)
      ctx.body = feedUrl
    } catch (error) {
      emitRouterError(error, ctx)
    }
  })

export const feedUrlRouter = router
