import {
    PipeTransform,
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: string) {
        if (!isValidObjectId(value)) {
            throw new HttpException(
                'ObjectId inválido.',
                HttpStatus.BAD_REQUEST
            );
        }
        return value;
    }
}
