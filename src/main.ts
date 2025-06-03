import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
