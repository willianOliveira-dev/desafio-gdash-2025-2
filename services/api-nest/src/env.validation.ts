import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class Env {
    @IsString()
    MONGO_URI: string;
    @IsNumber()
    PORT: number;
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
