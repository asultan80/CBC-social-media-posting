/**
 * PostDto
 * -------
 * Data Transfer Object for incoming post requests.
 * Contains message, platforms, optional media files, and scheduling information.
 */
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsArray()
  @IsNotEmpty()
  platforms: string[];

  @IsOptional()
  image?: Express.Multer.File;

  @IsOptional()
  video?: Express.Multer.File;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}
