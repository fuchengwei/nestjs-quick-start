import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ServerResponse } from '@/model/server-response.model'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = exception.getStatus()
    const resp = exception.getResponse()
    const message = typeof resp === 'string' ? resp : (resp as any).message.toString()
    response.status(status).send(new ServerResponse(status, message))
  }
}
