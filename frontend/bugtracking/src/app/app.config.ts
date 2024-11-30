import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations'; // Correct import
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        toastClass: 'custom-toast',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true,
        tapToDismiss: false,
      })
    ),
    provideRouter(routes),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
};
