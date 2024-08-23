import { IncomingMessage } from 'node:http';

export class IpService {
  constructor(private req: IncomingMessage) {}

  getClientIp(): string {
    const getIp = (header: string | string[] | undefined): string | null =>
      Array.isArray(header) ? header[0] : header ?? null;

    return (
      getIp(this.req.headers['cf-connecting-ip']) ??
      getIp(this.req.headers['x-forwarded-for']) ??
      this.req.socket.remoteAddress ??
      ''
    );
  }
}
