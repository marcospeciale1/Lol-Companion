import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appRouterProviders } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [appRouterProviders, provideHttpClient()],
}).catch((err) => console.error(err));
