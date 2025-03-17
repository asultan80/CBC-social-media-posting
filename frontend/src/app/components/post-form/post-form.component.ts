// src/app/components/post-form/post-form.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

/**
 * PostFormComponent
 * -----------------
 * Provides a form for the user to create and schedule social media posts.
 * Handles message input, file uploads, platform selection, and scheduling.
 * Submits the constructed FormData to the backend API.
 */
@Component({
  standalone: true,
  selector: 'app-post-form',
  imports: [
    FormsModule,
    CommonModule, // Required to support Angular common directives
  ],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent {
  /** The text message for the post */
  postMessage: string = '';

  /** Stores the selected image and video files */
  selectedFile: { image?: File; video?: File } = {};

  /** Stores the names of the uploaded files for display */
  selectedFileName: { image?: string; video?: string } = {};

  /** The scheduled date/time for the post */
  scheduledAt: string = '';

  /** User-selected platforms (checkbox state) */
  selectedPlatforms: Record<string, boolean> = {
    twitter: false,
    instagram: false,
    bluesky: false,
  };

  /** Reference to the image input element */
  @ViewChild('imageInput') imageInput!: ElementRef;
  /** Reference to the video input element */
  @ViewChild('videoInput') videoInput!: ElementRef;

  constructor(private http: HttpClient) {}

  /**
   * Handles file selection events.
   * Updates the corresponding file and file name based on the type ('image' or 'video').
   *
   * @param event - The change event fired by the file input.
   * @param fileType - Specifies whether the selected file is an image or a video.
   */
  onFileSelected(event: Event, fileType: 'image' | 'video'): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.selectedFile[fileType] = file;
      this.selectedFileName[fileType] = file.name; // Save file name for potential preview
    }
  }

  /**
   * Submits the post to the selected social media platforms.
   * Constructs a FormData object, performs basic validation, and posts data to the backend.
   * On a successful response, clears the form inputs.
   */
  postToSelectedPlatforms(): void {
    const platforms: string[] = Object.keys(this.selectedPlatforms).filter(
      (p) => this.selectedPlatforms[p]
    );

    // Validate that a message exists and at least one platform is selected.
    if (!this.postMessage.trim()) {
      alert('Please enter a message.');
      return;
    }
    if (platforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }

    // Prepare the FormData payload for submission.
    const formData = new FormData();
    formData.append('message', this.postMessage);
    formData.append('platforms', JSON.stringify(platforms));

    if (this.selectedFile.image) {
      formData.append('image', this.selectedFile.image);
    }
    if (this.selectedFile.video) {
      formData.append('video', this.selectedFile.video);
    }
    if (this.scheduledAt) {
      formData.append('scheduledAt', this.scheduledAt);
    }

    // Make the POST request to the backend.
    this.http.post('http://127.0.0.1:3000/post', formData).subscribe({
      complete: () => {
        console.log('Post complete');
      },
      next: (res: any) => {
        if (res.redirectUrl) {
          // If additional authentication is needed (e.g. OAuth), redirect accordingly.
          window.location.href = res.redirectUrl;
        } else {
          console.log('Post success:', res);
          if (this.scheduledAt) {
            alert(`Post successfully scheduled on platforms: ${platforms.join(', ')} at ${this.scheduledAt}`);
          } else {
            alert('Post successful on platforms: ' + platforms.join(', '));
          }
          // Clear all form values on a successful post.
          this.postMessage = '';
          this.scheduledAt = '';
          this.selectedFile = {};
          this.selectedFileName = {};
          this.selectedPlatforms = { twitter: false, instagram: false, bluesky: false };
          // Reset the file input elements using ViewChild references.
          if (this.imageInput) {
            this.imageInput.nativeElement.value = '';
          }
          if (this.videoInput) {
            this.videoInput.nativeElement.value = '';
          }
        }
      },
      error: (err) => {
        console.error('Post error:', err);
        alert('Error posting to selected platforms.' + err.message + err.error);
      },
    });
  }
}
