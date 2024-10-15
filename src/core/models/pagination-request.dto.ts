import { Injectable, PipeTransform, ArgumentMetadata } from "@nestjs/common";
import { Type, plainToInstance } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationRequestDto {
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    public readonly page?: number;
  
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    public readonly take?: number;
  }
  
  @Injectable()
  export class PaginationTransformPipe implements PipeTransform {
    async transform(dto: PaginationRequestDto, { metatype }: ArgumentMetadata) {
        if (!metatype) {
            return dto;
        }
  
        return plainToInstance(metatype, dto);
    }
  }