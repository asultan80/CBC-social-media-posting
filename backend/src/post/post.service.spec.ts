/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PostService } from './post.service';
import { PostDto } from './post.dto';

describe('PostService', () => {
  let postService: PostService;
  const twitterService = { postMessage: jest.fn() };
  const instagramService = { postMessage: jest.fn() };
  const blueskyService = { postMessage: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    postService = new PostService(
      twitterService as any,
      instagramService as any,
      blueskyService as any,
    );
  });

  it('should post to twitter and instagram (success and failure)', async () => {
    const postDto: PostDto = {
      message: 'Test message',
      platforms: ['twitter', 'instagram'],
    };
    // Mock twitter succeeds and instagram fails.
    twitterService.postMessage.mockResolvedValue({
      success: true,
      data: 'Tweet Posted',
    });
    blueskyService.postMessage.mockResolvedValue({
      success: true,
      data: 'Bluesky Posted',
    });

    const result = await postService.postToPlatforms(postDto, null, null);
    expect(twitterService.postMessage).toHaveBeenCalled();
    expect(blueskyService.postMessage).not.toHaveBeenCalled();
    expect(result).toHaveProperty('twitter');
    expect(result.twitter).toEqual({ success: true, data: 'Tweet Posted' });
  });

  it('should parse platforms from JSON string', async () => {
    const platformsJson = JSON.stringify(['twitter']);
    const postDto: PostDto = {
      message: 'JSON platforms test',
      platforms: platformsJson as any, // platforms passed as a JSON string
    };
    twitterService.postMessage.mockResolvedValue({
      success: true,
      data: 'Tweet OK',
    });

    const result = await postService.postToPlatforms(postDto, null, null);
    expect(twitterService.postMessage).toHaveBeenCalled();
    expect(result).toHaveProperty('twitter');
    expect(result.twitter).toEqual({ success: true, data: 'Tweet OK' });
  });

  it('should handle unsupported platform', async () => {
    const postDto: PostDto = {
      message: 'Unsupported platform test',
      platforms: ['linkedin'], // an unsupported platform value
    };

    const result = await postService.postToPlatforms(postDto, null, null);
    // Assuming that unsupported platforms obtain a default error with key 'unknown'
    expect(result).toHaveProperty('unknown');
    expect(result.unknown.success).toBe(false);
    expect(result.unknown.error).toContain('Unsupported platform');
  });

  it('should throw error if platforms is not valid JSON', async () => {
    const postDto: PostDto = {
      message: 'Invalid JSON',
      platforms: 'not a json' as any, // invalid JSON string
    };

    await expect(
      postService.postToPlatforms(postDto, null, null),
    ).rejects.toThrow(/Failed to parse platforms/);
  });
});
