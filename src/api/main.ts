import { NestFactory } from '@nestjs/core'
import * as basicAuth from 'express-basic-auth'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { RequestLoggerInterceptor } from './infrastructure/interceptors/request-logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  })

  app.setGlobalPrefix('v1')

  // Add logger
  app.useLogger(app.get(Logger))

  app.useGlobalInterceptors(new RequestLoggerInterceptor())

  // Add login/password to access to API Documentation
  const basicAuthOptions: basicAuth.IUsersOptions = {
    challenge: true,
    users: {}
  }
  basicAuthOptions.users[process.env.DOC_LOGIN] = process.env.DOC_PASSWORD
  app.use(['/doc', '/doc-json'], basicAuth(basicAuthOptions))

  // Add API Documentation with Swagger
  const config = new DocumentBuilder()
    .setTitle('API JuriTJ')
    .setDescription(
      "Documentation de l'API JuriTJ, qui permet la collecte, le traitement et la mise en Open Data de décisions de tribunaux judiciaires."
    )
    .setVersion('1.0')
    .addTag('Collect')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
