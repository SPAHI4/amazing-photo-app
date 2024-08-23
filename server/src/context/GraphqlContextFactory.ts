import { IncomingMessage, ServerResponse } from 'node:http';
import { GraphqlContext } from '../types/GraphQLContext.js';
import { CookieService } from '../services/CookiesService.js';
import { IpService } from '../services/IpService.js';

export class GraphqlContextFactory {
  static async create(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<Omit<GraphqlContext, 'pgClient'>> {
    const cookieService = new CookieService(req, res);
    const ipService = new IpService(req);

    return {
      getRefreshTokenCookie: () => cookieService.getRefreshTokenCookie(),
      setRefreshTokenCookie: (token: string) => cookieService.setRefreshTokenCookie(token),
      cleanCookies: () => cookieService.cleanCookies(),
      clientIp: ipService.getClientIp(),
      jwtClaims: null, // This should be set after JWT verification
      pgRole: 'app_anonymous', // This should be set based on authentication
    };
  }
}
