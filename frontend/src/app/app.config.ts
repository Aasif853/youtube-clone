import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  responseTimeInterceptorFunctional,
  loadingSpinnerInterceptorFunctional,
  authInterceptorFunctional,
  retryInterceptorFunctional,
  loggingInterceptorFunctional,
  baseUrlInterceptor,
} from './interceptors/headerHttp.interceptor';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment.development';
import { provideImgixLoader } from '@angular/common';
import { CustomReuseStrategy } from './shared/reuse-routing';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideImgixLoader(environment.mediaUrl),
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        responseTimeInterceptorFunctional,
        loadingSpinnerInterceptorFunctional,
        authInterceptorFunctional,
        // retryInterceptorFunctional,
        loggingInterceptorFunctional,
      ]),
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.client_id),
          },
        ],
        onError: (error: any) => {
          console.error(error);
        },
      },
    },
  ],
};
