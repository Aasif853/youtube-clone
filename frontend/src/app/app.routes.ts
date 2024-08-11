import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ListingComponent } from './modules/listing/listing.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ListingComponent,
      },
    ],
  },
  { path: '*', redirectTo: '/' },
];
