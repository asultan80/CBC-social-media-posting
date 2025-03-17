/**
 * PostService
 * -----------
 * Orchestrates posting across multiple social media platforms.
 * This service builds a domain Post model from the DTO, determines selected platforms,
 * delegates posting to platform-specific services, and consolidates the results.
 */
import { Injectable } from '@nestjs/common';
import { TwitterService } from '../platform/twitter.service';
import { InstagramService } from '../platform/instagram.service';
import { BlueskyService } from '../platform/bluesky.service';
import { PostDto } from './post.dto';
import { Post as SocialPost } from './post.model';

@Injectable()
export class PostService {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly instagramService: InstagramService,
    private readonly blueskyService: BlueskyService,
  ) {}

  /**
   * postToPlatforms
   * ---------------
   * Posts the constructed message and media to each selected platform.
   *
   * @param postDto - Contains the message and selected platforms.
   * @param image - Optional image file.
   * @param video - Optional video file.
   * @returns Result object keyed by platform.
   */
  async postToPlatforms(
    postDto: PostDto,
    image: Express.Multer.File | null,
    video: Express.Multer.File | null,
  ): Promise<Record<string, any>> {
    // Create domain Post model.
    const post = new SocialPost(
      postDto.message,
      postDto.platforms,
      image,
      video,
    );
    const results: Record<string, any> = {};

    let platforms: string[];

    // Parse platforms if provided as a JSON string.
    if (typeof postDto.platforms === 'string') {
      try {
        const parsed: unknown = JSON.parse(postDto.platforms);
        if (Array.isArray(parsed)) {
          platforms = parsed as string[];
        } else {
          throw new Error('Platforms is not an array');
        }
      } catch (err) {
        throw new Error(`Failed to parse platforms: ${err}`);
      }
    } else {
      platforms = postDto.platforms;
    }
    post.platforms = platforms;
    // Map each platform to its associated post promise.
    const tasks = platforms.map((platform) => {
      switch (platform) {
        case 'twitter':
          return this.twitterService
            .postMessage(post)
            .then((result) => ({ platform, result }))
            .catch((error) => ({
              platform,
              result: {
                success: false,
                error: String((error as Error).message),
              },
            }));
        case 'instagram':
          return this.instagramService
            .postMessage(post)
            .then((result) => ({ platform, result }))
            .catch((error) => ({
              platform,
              result: {
                success: false,
                error: String((error as Error).message),
              },
            }));
        case 'bluesky':
          return this.blueskyService
            .postMessage(post)
            .then((result) => ({ platform, result }))
            .catch((error) => ({
              platform,
              result: {
                success: false,
                error: String((error as Error).message),
              },
            }));
        default:
          return Promise.resolve({
            platform,
            result: {
              success: false,
              error: `Unsupported platform: ${platform}`,
            },
          });
      }
    });

    // Wait for all platform tasks to settle.
    const settledResults = await Promise.allSettled(tasks);

    // Compile results from each platform.
    for (const task of settledResults) {
      if (task.status === 'fulfilled') {
        results[task.value.platform] = task.value.result;
      } else {
        results['unknown'] = { success: false, error: String(task.reason) };
      }
    }

    return { success: true, message: 'Post updated', results };
  }
}
