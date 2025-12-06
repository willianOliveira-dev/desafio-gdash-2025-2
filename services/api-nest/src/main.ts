import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env.validation'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-execption.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { join } from 'node:path'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerResponseModel } from './common/swagger/model/swagger-response.model'
import { AvatarModelSwaggerDto } from './common/swagger/dto/avatar-model-swagger.dto'
import { CharacterModelSwaggerDto } from './common/swagger/dto/character-model-swagger.dto'
import { CharacterPaginationSwaggerDto } from './common/swagger/dto/character-pagination-swagger.dto'
import { LocationModelSwaggerDto } from './common/swagger/dto/location-model-swagger.dto'
import { UserModelWithoutPasswordSwaggerDto } from './common/swagger/dto/user-model-without-password-swagger.dto'
import { WeatherInsightsSwaggerDto } from './common/swagger/dto/weather-insights-swagger.dto'
import { WeatherModelSwaggerDto } from './common/swagger/dto/weather-model-swagger.dto'
import { WeatherPageResultSwaggerDto } from './common/swagger/dto/weather-page-result-swagger.dto'
import { CreateUserDto } from './modules/users/dto/create-user.dto'
import { CreateWeatherDto } from './modules/weathers/dto/create-weather.dto'
import { LoginDto } from './modules/auth/dto/login.dto'
import { UpdateUserDto } from './modules/users/dto/update-user.dto'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService<Env>)
  const staticFilePath: string = join(__dirname, '..', 'public')
  const BASE_API = config.get('BASE_API') as string
  const BASE_URL = config.get('BASE_URL') as string
  const FRONTEND_URL = config.get('FRONTEND_URL') as string

  app.setGlobalPrefix(BASE_API)

  const docConfig = new DocumentBuilder()
    .setTitle('GDASH API')
    .setDescription(`
        API do desafio GDASH 2025. 
        
        Autenticação: O login é realizado via rota POST /auth/login. Após a autenticação bem-sucedida, os tokens são armazenados automaticamente pelo seu navegador em Cookies HTTP-only.
        
        Isso garante uma maior segurança contra ataques XSS (Cross-Site Scripting) e CSRF (Cross-Site Request Forgery). Ao logar, o Swagger UI poderá acessar automaticamente todas as rotas privadas sem a necessidade de manipular manualmente os tokens.
    `)
    .setVersion('1.0')
    .setBasePath(`/${BASE_API}`)
    .build()

  const document = SwaggerModule.createDocument(app, docConfig, {
    extraModels: [
      SwaggerResponseModel,
      AvatarModelSwaggerDto,
      CharacterModelSwaggerDto,
      CharacterPaginationSwaggerDto,
      LocationModelSwaggerDto,
      UserModelWithoutPasswordSwaggerDto,
      WeatherInsightsSwaggerDto,
      WeatherModelSwaggerDto,
      WeatherPageResultSwaggerDto,
      CreateUserDto,
      LoginDto,
      UpdateUserDto,
      CreateWeatherDto,
    ],
  })
  SwaggerModule.setup('docs', app, document)

  app.useStaticAssets(staticFilePath, { prefix: '/public/' })

  app.use(cookieParser.default())
  app.use(morgan('dev'))
  app.use(helmet())
  app.use(compression())

  app.enableCors({
    origin: FRONTEND_URL,
    credentials: true,
  })

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  await app.listen(config.get('PORT') ?? 3000)

  console.log(
    `🔥 API rodando em ${BASE_URL}/${BASE_API}
         📘 Documentação em ${BASE_URL}/docs
        `,
  )
}
bootstrap()
