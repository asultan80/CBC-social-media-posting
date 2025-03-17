/**
 * BlueskyService
 * --------------
 * Implements ISocialMediaPlatform for posting to Bluesky.
 * Handles authentication (or redirection for OAuth), media uploads, and post submissions.
 */
import { Injectable } from '@nestjs/common';
import { AtpAgent, BlobRef } from '@atproto/api';
import { ISocialMediaPlatform } from './platform.interface';
import { Post } from '../post/post.model';
import * as dotenv from 'dotenv';

dotenv.config();
const { BLUESKY_OAUTH_TOKEN, BLUESKY_HANDLE } = process.env;
const BLUESKY_SERVICE = 'https://bsky.social';

@Injectable()
export class BlueskyService implements ISocialMediaPlatform {
  private agent: AtpAgent;

  constructor() {
    // Initialize the AtpAgent for Bluesky interactions.
    this.agent = new AtpAgent({ service: BLUESKY_SERVICE });
    console.log('BlueskyService initialized');
  }

  /**
   * Authenticates with Bluesky.
   * If OAuth credentials are provided, logs in; otherwise, returns a redirect URL.
   *
   * @returns An object with success flag, optional data, and redirectUrl if needed.
   */
  private async authenticate(): Promise<{
    success: boolean;
    data?: any;
    redirectUrl?: string;
  }> {
    try {
      if (BLUESKY_OAUTH_TOKEN && BLUESKY_HANDLE) {
        const response = await this.agent.login({
          identifier: BLUESKY_HANDLE || '',
          password: BLUESKY_OAUTH_TOKEN || '',
        });
        return { success: response.success, data: response.data };
      } else {
        const clientId = process.env.BLUESKY_CLIENT_ID || '';
        const redirectUri =
          process.env.BLUESKY_CALLBACK_URL ||
          'http://127.0.0.1:3000/auth/bluesky/callback';
        const redirectUrl = `${BLUESKY_SERVICE}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}&response_type=token`;
        console.log(
          'No OAuth token provided. Redirecting for authentication to:',
          redirectUrl,
        );
        return { success: false, redirectUrl };
      }
    } catch (error) {
      console.error('Authentication error:', (error as Error).message);
      return { success: false };
    }
  }

  /**
   * Posts a message to Bluesky after ensuring authentication.
   * Uploads media (image or video) and constructs the embed for the post.
   *
   * @param post - The domain Post model.
   * @returns Result object containing success flag, data, error, and optional redirectUrl.
   */
  async postMessage(post: Post): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    redirectUrl?: string;
  }> {
    try {
      const auth = await this.authenticate();
      if (!auth.success) {
        return {
          success: false,
          error: 'Authentication required.',
          redirectUrl: auth.redirectUrl,
        };
      }

      let embed: {
        $type: string;
        video?: BlobRef;
        images?: { image: BlobRef; alt: string }[];
      } | null = null;

      // If only an image is provided, upload and create an image embed.
      if (post.image && !post.video) {
        console.log('Bsky:Uploading image...');
        const imageResponse = await this.agent.uploadBlob(post.image.buffer);
        const imageMediaId = imageResponse.data.blob;
        embed = {
          $type: 'app.bsky.embed.images',
          images: [
            {
              image: imageMediaId,
              alt: post.image.originalname || 'Uploaded Image',
            },
          ],
        };
      }
      // If a video is provided, upload and create a video embed.
      if (post.video) {
        console.log('Bsky:Uploading video...');
        const videoResponse = await this.agent.uploadBlob(post.video.buffer);
        const videoMediaId = videoResponse.data.blob;
        embed = {
          $type: 'app.bsky.embed.video',
          video: videoMediaId,
        };
      }

      // Build the post data, including text and embed if available.
      const postData: Partial<Record<string, any>> &
        Omit<Record<string, any>, 'createdAt'> = { text: post.message };
      if (embed) {
        postData.embed = embed as {
          $type: string;
          video?: BlobRef;
          images?: { image: string; alt: string }[];
        };
      }

      const response = await this.agent.post(postData);
      console.log('Bsky:Posted');
      return { success: true, data: response };
    } catch (error) {
      console.error(
        'Failed to post to Bluesky:',
        error ? (error as Error).message : error,
      );
      return { success: false, error: (error as Error).message };
    }
  }
}
