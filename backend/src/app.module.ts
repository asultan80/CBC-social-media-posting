/**
 * AppModule
 * ---------
 * The root module of the backend application.
 * Registers controllers and providers for post handling and platform integrations.
 */
import { Module } from '@nestjs/common';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { SchedulerService } from './post/scheduler.service';
import { TwitterService } from './platform/twitter.service';
import { InstagramService } from './platform/instagram.service';
import { BlueskyService } from './platform/bluesky.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    SchedulerService,
    TwitterService,
    InstagramService,
    BlueskyService,
  ],
})
export class AppModule {}
