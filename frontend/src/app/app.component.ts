// src/app/app.component.ts
import { Component } from '@angular/core';
// Import the PostFormComponent to render the post form within the app.
import { PostFormComponent } from './components/post-form/post-form.component';

/**
 * AppComponent
 * ------------
 * Serves as the root component for the frontend application.
 * It displays the overall layout and includes the PostFormComponent.
 */
@Component({
  standalone: true,
  imports: [
    // Register child components
    PostFormComponent,
  ],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Render the post form component -->
      <app-post-form></app-post-form>
    </div>
  `,
})
export class AppComponent {
  title = 'CBC Social Media Frontend';
}
