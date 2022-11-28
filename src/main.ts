import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as basicAuth from 'express-basic-auth'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  })

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
    .setDescription("Documentation de l'API JuriTJ. ")
    .setVersion('1.0')
    .addTag('Collect')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
