/**
 * PostController
 * --------------
 * Handles incoming HTTP requests for posting content.
 * Determines whether to schedule a post or to post immediately.
 */
import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostDto } from './post.dto';
import { PostService } from './post.service';
import { SchedulerService } from './scheduler.service';

type MulterFile = Express.Multer.File;

interface UploadedMediaFiles {
  image?: MulterFile[];
  video?: MulterFile[];
}

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async post(
    @Body() postDto: PostDto,
    @UploadedFiles() files: UploadedMediaFiles,
  ) {
    // Extract uploaded files, if any.
    const image: MulterFile | null = files.image?.[0] ?? null;
    const video: MulterFile | null = files.video?.[0] ?? null;

    // Determine if the post is scheduled. Delegate accordingly.
    if (postDto.scheduledAt) {
      return await this.schedulerService.schedulePost(postDto, image, video);
    } else {
      return await this.postService.postToPlatforms(postDto, image, video);
    }
  }
}
