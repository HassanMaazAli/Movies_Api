import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class AddMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  releaseYear?: number;
}