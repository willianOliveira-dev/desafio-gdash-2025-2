import { createHash, timingSafeEqual } from 'node:crypto'
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import type { Env } from 'src/env.validation'

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const providedToken = request.header('x-worker-token')
    const expectedToken = this.config.get('WORKER_API_TOKEN', { infer: true })

    if (!providedToken || !expectedToken) {
      throw new UnauthorizedException('Credencial do worker ausente.')
    }

    const providedDigest = createHash('sha256').update(providedToken).digest()
    const expectedDigest = createHash('sha256').update(expectedToken).digest()

    if (!timingSafeEqual(providedDigest, expectedDigest)) {
      throw new UnauthorizedException('Credencial do worker invalida.')
    }

    return true
  }
}
