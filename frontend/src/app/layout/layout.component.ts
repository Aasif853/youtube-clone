import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CategoryComponent } from './common/category/category.component';
import { HeaderComponent } from './common/header/header.component';
import { ListingComponent } from '../modules/listing/listing.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule,
    SidebarComponent,
    CategoryComponent,
    HeaderComponent,
    ListingComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
