import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TagCreateDto {
  @IsString({ message: 'No name' })
  name: string;

  // @IsString({ message: 'No creator' })
  // creator: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
