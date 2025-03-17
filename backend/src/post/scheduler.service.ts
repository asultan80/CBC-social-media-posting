/**
 * SchedulerService
 * ----------------
 * Manages scheduling of posts via a Bull queue.
 * This service initializes a Bull queue with Redis settings, processes queued jobs by
 * deserializing file buffers if necessary, and delegates posting logic to PostService.
 */
import { Injectable, Logger } from '@nestjs/common';
import * as Bull from 'bull';
import { Queue } from 'bull';
import { PostService } from './post.service.js';
import { PostDto } from './post.dto.js';

interface SerializedBuffer {
  type: string;
  data: number[];
}

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private postQueue: Queue<any>;

  constructor(private readonly postService: PostService) {
    // Initialize Bull queue using Redis connection settings.
    // Host and port can be overridden via environment variables.
    this.postQueue = new Bull('postQueue', {
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    });

    // Set up the processor to handle job execution for scheduled posts.
    void this.postQueue.process(
      async (
        job: Bull.Job<{
          postDto: PostDto;
          image: Express.Multer.File | null;
          video: Express.Multer.File | null;
        }>,
      ) => {
        this.logger.log(`Processing scheduled post job: ${job.id}`);
        const { postDto, image, video } = job.data;
        // Check and convert image buffer if serialized
        if (image) {
          this.convertBuffer(image);
        }
        // Check and convert video buffer if serialized
        if (video) {
          this.convertBuffer(video);
        }
        // Delegate posting to PostService and return its result.
        return await this.postService.postToPlatforms(postDto, image, video);
      },
    );
  }

  /**
   * Schedules a post by adding a job to the Bull queue with a calculated delay.
   * @param postDto - The post transfer object containing message, platforms, and optional scheduling info.
   * @param image - Optional image file.
   * @param video - Optional video file.
   * @returns Job info object.
   */
  async schedulePost(
    postDto: PostDto,
    image: Express.Multer.File | null,
    video: Express.Multer.File | null,
  ): Promise<Record<string, any>> {
    let delay = 0;
    if (postDto.scheduledAt) {
      const scheduledAt = new Date(postDto.scheduledAt);
      delay = scheduledAt.getTime() - Date.now();
      if (delay < 0) {
        delay = 0; // If schedule time in the past, post immediately.
      }
    }
    this.logger.log(`Scheduling post with delay: ${delay}ms`);
    // Add job to the queue with computed delay.
    return await this.postQueue.add({ postDto, image, video }, { delay });
  }

  /**
   * Checks whether the provided object is a serialized Buffer.
   * @param obj - The object to evaluate.
   * @returns True if the object matches the SerializedBuffer shape.
   */
  private isSerializedBuffer(obj: any): obj is SerializedBuffer {
    if (obj && typeof obj === 'object') {
      const candidate = obj as { type?: unknown; data?: unknown };
      return candidate.type === 'Buffer' && Array.isArray(candidate.data);
    }
    return false;
  }

  // Helper for buffer conversion.
  private convertBuffer(file: Express.Multer.File): void {
    if (file && file.buffer && !(file.buffer instanceof Buffer)) {
      const serialized = file.buffer as unknown;
      if (this.isSerializedBuffer(serialized)) {
        file.buffer = Buffer.from(serialized.data);
      }
    }
  }
}
