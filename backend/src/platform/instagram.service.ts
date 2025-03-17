/**
 * InstagramService
 * ----------------
 * Implements ISocialMediaPlatform for posting to Instagram.
 * Utilizes the Facebook Graph API for media uploads and post publications.
 */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ISocialMediaPlatform } from './platform.interface';
import { Post } from '../post/post.model';
import * as dotenv from 'dotenv';
import FormData from 'form-data';

dotenv.config();
const { INSTAGRAM_ACCESS_TOKEN } = process.env;
const GRAPH_SERVICE = 'https://graph.facebook.com/v12.0';

@Injectable()
export class InstagramService implements ISocialMediaPlatform {
  /**
   * Posts a message to Instagram.
   * Uploads image or video, publishes the media, and returns the publication result.
   *
   * @param post - The domain Post model.
   * @returns Post result with data or error.
   */
  async postMessage(post: Post) {
    try {
      const accessToken = INSTAGRAM_ACCESS_TOKEN || '';
      let mediaId: string | null = null;

      // Handle image upload if present.
      if (post.image) {
        const formData = new FormData();
        formData.append('image', post.image.buffer);
        formData.append('access_token', accessToken);

        const mediaUploadResponse = await axios.post(
          `${GRAPH_SERVICE}/me/media`,
          formData,
        );
        mediaId = (mediaUploadResponse.data as { id: string }).id;
      }

      // Handle video upload if present.
      if (post.video) {
        const formData = new FormData();
        formData.append('video', post.video.buffer);
        formData.append('access_token', accessToken);

        const mediaUploadResponse = await axios.post(
          `${GRAPH_SERVICE}/me/media`,
          formData,
        );
        mediaId = (mediaUploadResponse.data as { id: string }).id;
      }

      // Publish the media.
      const publishResponse = await axios.post(
        `${GRAPH_SERVICE}/me/media_publish?creation_id=${mediaId}&access_token=${accessToken}`,
      );
      console.log('Instagram post published:', publishResponse.data);

      return { success: true, data: publishResponse.data as { id: string } };
    } catch (error) {
      console.error('Instagram post error:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}
