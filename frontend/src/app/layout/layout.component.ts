import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CategoryComponent } from './common/category/category.component';
import { HeaderComponent } from './common/header/header.component';
import { ListingComponent } from '../modules/listing/listing.component';
import { UserComponent } from './common/user/user.component';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    SharedModule,
    SidebarComponent,
    HeaderComponent,
    ListingComponent,
    UserComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  public loaderService = inject(LoadingService);
  isLoading = this.loaderService.loading;
  ngOnInit(): void {
    console.log('loaderserice in layout', this.loaderService.loading());
  }
}
