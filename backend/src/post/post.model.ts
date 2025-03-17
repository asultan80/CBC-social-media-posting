/**
 * Post Model
 * ----------
 * Represents a social media post with message, selected platforms,
 * and optional media attachments.
 */
export class Post {
  constructor(
    public message: string,
    public platforms: string[],
    public image?: Express.Multer.File | null,
    public video?: Express.Multer.File | null,
  ) {
    this.message = message;
    this.platforms = platforms;
    this.image = image ?? null;
    this.video = video ?? null;
  }
}
