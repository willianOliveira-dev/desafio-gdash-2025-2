import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

export class Env {
    @IsString()
    MONGO_URI: string;
    @IsNumber()
    PORT: number;
    @IsString()
    JWT_ACCESS_SECRET: string;
    @IsString()
    JWT_ACCESS_EXPIRES: string;
    @IsString()
    JWT_REFRESH_SECRET: string;
    @IsString()
    JWT_REFRESH_EXPIRES: string;
    @IsString()
    FRONTEND_URL: string;
    @IsString()
    COOKIE_SAMESITE: string;
    @IsNumber()
    COOKIE_ACCESS_EXPIRES: number;
    @IsNumber()
    COOKIE_REFRESH_EXPIRES: number;
    @IsString()
    NODE_ENV: string;
}

export function validateEnv(config: Record<string, unknown>) {
    const validatedConfig: Env = plainToInstance(Env, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        console.error(errors);
        throw new Error('Variáveis de ambiente inválidas!');
    }

    return validatedConfig;
}
