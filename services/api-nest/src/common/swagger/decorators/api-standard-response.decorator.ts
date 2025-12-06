import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { SwaggerResponseModel } from '../model/swagger-response.model'
import {
  SchemaObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export function ApiStandardResponse<TModel extends Type<any> | null>(
  model?: TModel | null,
  isArray: boolean = false,
  statusCode: number = 200,
) {
  let dataSchema: SchemaObject | ReferenceObject = {}

  if (model) {
    ApiExtraModels(SwaggerResponseModel, model)

    const modelRef: ReferenceObject = {
      $ref: getSchemaPath(model),
    }

    if (isArray) {
      dataSchema = {
        type: 'array',
        items: modelRef,
      }
    } else {
      dataSchema = modelRef
    }
  } else {
    dataSchema = {
      type: 'null',
      nullable: true,
    }
  }
  const ResponseDecorator =
    statusCode === 201 ? ApiCreatedResponse : ApiOkResponse

  return applyDecorators(
    ApiExtraModels(SwaggerResponseModel),
    ResponseDecorator({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SwaggerResponseModel) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  )
}
