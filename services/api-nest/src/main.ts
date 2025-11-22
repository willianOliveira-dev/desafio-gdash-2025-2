import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.validation';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-execption.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const BASE_API = 'api/v1/gdash';
    const config = app.get(ConfigService<Env>);

    app.setGlobalPrefix(BASE_API);

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    await app.listen(config.get('PORT') ?? 3000);

    console.log(
        `🔥 API rodando em http://localhost:${config.get('PORT')}/${BASE_API}`
    );
    console.log(
        `📘 Documentação em http://localhost:${config.get('PORT')}/docs`
    );
}
bootstrap();
