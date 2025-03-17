/**
 * ISocialMediaPlatform
 * --------------------
 * Defines the contract for posting messages to a social media platform.
 */
import { Post } from '../post/post.model';

export interface ISocialMediaPlatform {
  postMessage(
    post: Post,
  ): Promise<{ success: boolean; data?: any; error?: string }>;
}
