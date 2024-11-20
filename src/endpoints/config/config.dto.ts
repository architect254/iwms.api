import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';

export class PageDto {
  @IsString()
  page_name: string;

  @IsString()
  home_content: string;

  // @IsString()
  // about_content: string;
}
export class ConfigDto {
  @IsString()
  host: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PageDto)
  pageDto: PageDto;
}
