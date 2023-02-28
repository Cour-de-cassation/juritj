import { NestFactory } from '@nestjs/core'
import * as basicAuth from 'express-basic-auth'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { Context } from '../shared/infrastructure/utils/context'
import { CustomLogger } from '../shared/infrastructure/utils/customLogger.utils'
import { RequestLoggerInterceptor } from './infrastructure/interceptors/request-logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  })

  // Create a global store with AsyncLocalStorage and provide it to the logger
  const apiContext = new Context()
  apiContext.start()
  const customLogger = new CustomLogger(apiContext)

  app.useLogger(customLogger)
  app.useGlobalInterceptors(new RequestLoggerInterceptor(apiContext))

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
    .setVersion('1.0.0')
    .addTag('Collect')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
