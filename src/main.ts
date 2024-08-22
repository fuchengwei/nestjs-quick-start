import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { HttpExceptionFilter } from '@/common/filter/http-exception.filter'
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(3000, '0.0.0.0')
}

bootstrap()
