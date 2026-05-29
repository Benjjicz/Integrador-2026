import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), 
    {
      provide: ErrorHandler,
      useClass: class GlobalErrorHandler implements ErrorHandler {
        handleError(error: any): void {
          console.error('Anomalía global interceptada por Angular:', error);
        }
      }
    }
  ]
};