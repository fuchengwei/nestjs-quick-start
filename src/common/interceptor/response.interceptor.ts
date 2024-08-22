import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { FastifyReply } from 'fastify'
import { ServerResponse } from '@/model/server-response.model'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ServerResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ServerResponse<T>> | Promise<Observable<ServerResponse<T>>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()

        if (data instanceof ServerResponse) {
          return data
        }

        return new ServerResponse(response.statusCode, '请求成功', data)
      })
    )
  }
}
