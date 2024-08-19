import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  responseTimeInterceptorFunctional,
  loadingSpinnerInterceptorFunctional,
  authInterceptorFunctional,
  retryInterceptorFunctional,
  loggingInterceptorFunctional,
  baseUrlInterceptor,
} from "./interceptors/headerHttp.interceptor";
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { environment } from "../environments/environment.development";
import { CoolStorageModule } from "angular2-cool-storage";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    CoolStorageModule,
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        responseTimeInterceptorFunctional,
        loadingSpinnerInterceptorFunctional,
        authInterceptorFunctional,
        retryInterceptorFunctional,
        loggingInterceptorFunctional,
      ]),
    ),
    {
      provide: "SocialAuthServiceConfig",
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
