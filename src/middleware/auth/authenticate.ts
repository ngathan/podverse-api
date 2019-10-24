import { generateToken } from '~/services/auth/generateToken'
import { authExpires } from '~/lib/constants'
import { config } from '~/config'

export function authenticate (ctx, next) {
  return generateToken(ctx.state.user)
    .then(bearerToken => {
      if (bearerToken) {
        const expires = authExpires()

        const { user } = ctx.state
        ctx.body = {
          email: user.email,
          emailVerified: user.emailVerified,
          freeTrialExpiration: user.freeTrialExpiration,
          historyItems: user.historyItems,
          id: user.id,
          isPublic: user.isPublic,
          membershipExpiration: user.membershipExpiration,
          name: user.name,
          playlists: user.playlists,
          queueItems: user.queueItems,
          subscribedPlaylistIds: user.subscribedPlaylistIds,
          subscribedPodcastIds: user.subscribedPodcastIds,
          subscribedUserIds: user.subscribedUserIds
        }

        if (ctx.query.includeBodyToken) {
          ctx.body.token = `Bearer ${bearerToken}`
        } else {
          ctx.cookies.set('Authorization', `Bearer ${bearerToken}`, {
            domain: config.cookieDomain,
            expires,
            httpOnly: true,
            overwrite: true,
            secure: config.cookieIsSecure
          })
        }

        ctx.status = 200
      } else {
        ctx.status = 500
      }

      next()
    })
}
