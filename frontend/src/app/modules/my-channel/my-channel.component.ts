import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListingComponent } from '../listing/listing.component';
import { CreateVideoComponent } from './pages/create-video/create-video.component';
import { ActivatedRoute, Routes } from '@angular/router';
import { ChannelEditComponent } from './pages/channel-edit/channel-edit.component';
import { AppSettingService } from '../../service/appSetting.service';
import { ChannelService } from '../../service/channel.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    SharedModule,
    ListingComponent,
    CreateVideoComponent,
    ChannelEditComponent,
  ],
  templateUrl: './my-channel.component.html',
  styleUrl: './my-channel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MyChannelComponent implements OnInit {
  user: any;

  appSettingService = inject(AppSettingService);
  authService = inject(AuthService);
  channelId!: string;
  channelDetails!: any;
  route = inject(ActivatedRoute);
  channelService = inject(ChannelService);

  ngOnInit(): void {
    this.authService.userSettings$.subscribe((data) => {
      this.user = data;
      this.onUserChange();
    });
  }

  onUserChange() {
    this.channelId = this.user?.channelId;

    if (this.channelId) this.getChnnelDetails();
  }

  getChnnelDetails() {
    this.channelService.getSingleVideo(this.channelId).subscribe((data) => {
      console.log('🚀 ~ ChannelComponent ~ .subscribe ~ data:', data);
      this.channelDetails = data;
    });
  }
}
export const routes: Routes = [
  { path: '', component: MyChannelComponent },
  { path: 'upload', component: CreateVideoComponent },
];
