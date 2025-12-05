import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserPayload } from 'src/common/decorators/get-user-payload.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AvatarsService } from '../services/avatars.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.validation';
import { UsersService } from 'src/modules/users/services/users.service';
import type { ResponseApi } from 'src/common/interfaces/response-api.interface';
import multer from 'multer';

@Controller('avatars')
@UseGuards(JwtAuthGuard)
export class AvatarsController {
    constructor(
        private readonly avatarsService: AvatarsService,
        private readonly config: ConfigService<Env>,
        private readonly usersService: UsersService
    ) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter: (_, file: Express.Multer.File, cb) => {
                const allowed: [string, string, string] = [
                    'image/png',
                    'image/jpg',
                    'image/jpeg',
                ];
                if (allowed.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            'Somente arquivos JPG/PNG são permitidos.',
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
                }
            },
        })
    )
    async uploadImage(
        @Body('userId') userId: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ResponseApi<{ url: string }>> {
        if (!userId) {
            throw new HttpException(
                'ID do usuário é obrigatório.',
                HttpStatus.BAD_REQUEST
            );
        }
        await this.usersService.findOne(userId);

        let url: string;

        if (this.config.get('ENABLE_AVATAR_UPLOAD') === 'true') {
            url = await this.avatarsService.uploadImage(file, userId);
        } else {
            const baseUrl = this.config.get('BASE_URL') as string;
            url = `${baseUrl}/public/images/default-avatar.png`;
        }

        await this.usersService.update({ avatar: url }, userId);

        return { message: 'Avatar atualizado com sucesso.', data: { url } };
    }
}
