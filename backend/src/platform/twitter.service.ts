/**
 * TwitterService
 * --------------
 * Implements ISocialMediaPlatform for posting messages to Twitter.
 * Handles image and video uploads before tweeting the message.
 */
import { Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import { ISocialMediaPlatform } from './platform.interface';
import { Post } from '../post/post.model';
import * as dotenv from 'dotenv';

dotenv.config();
const {
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
} = process.env;

@Injectable()
export class TwitterService implements ISocialMediaPlatform {
  private client: TwitterApi;

  constructor() {
    // Initialize TwitterApi client with credentials.
    this.client = new TwitterApi({
      appKey: TWITTER_API_KEY || '',
      appSecret: TWITTER_API_SECRET || '',
      accessToken: TWITTER_ACCESS_TOKEN || '',
      accessSecret: TWITTER_ACCESS_SECRET || '',
    });
    console.log('TwitterService initialized');
  }

  /**
   * Posts a message to Twitter including media if provided.
   * Uploads images and videos, constructs the tweet, and sends it.
   *
   * @param post - The domain Post model.
   * @returns Result object with success status and tweet data.
   */
  async postMessage(post: Post) {
    try {
      let mediaImgId: string | null = null;
      let mediaVidId: string | null = null;

      if (post.image) {
        console.log('Twitter:Uploading image...');
        mediaImgId = await this.client.v1.uploadMedia(post.image.buffer, {
          type: 'image/jpeg',
        });
      }
      if (post.video) {
        console.log('Twitter:Uploading video...');
        mediaVidId = await this.client.v1.uploadMedia(post.video.buffer, {
          type: 'video/mp4',
        });
      }
      let mediaIds: any = undefined;
      if (mediaImgId) {
        mediaIds = [mediaImgId];
      }
      if (mediaVidId) {
        mediaIds = mediaImgId ? [mediaImgId, mediaVidId] : [mediaVidId];
      }

      const tweet = await this.client.v2.tweet(
        post.message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mediaIds ? { media: { media_ids: mediaIds } } : {},
      );
      console.log('Twitter:Posted');
      return { success: true, data: tweet };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
