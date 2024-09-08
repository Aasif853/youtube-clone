import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListingComponent } from '../listing/listing.component';
import { ActivatedRoute, Routes } from '@angular/router';
import { ChannelService } from '../../service/channel.service';
import { AppSettingService } from '../../service/appSetting.service';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [SharedModule, ListingComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChannelComponent implements OnInit {
  channelId!: string;
  channelDetails!: any;
  route = inject(ActivatedRoute);
  channelService = inject(ChannelService);
  appSettingService = inject(AppSettingService);
  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  ngOnInit(): void {
    this.channelId = this.route.snapshot.params['id'];
    if (this.channelId) this.getChnnelDetails();
  }

  getChnnelDetails() {
    this.channelService.getSingleVideo(this.channelId).subscribe((data) => {
      console.log('🚀 ~ ChannelComponent ~ .subscribe ~ data:', data);
      this.channelDetails = data;
    });
  }

  subscibeToChannel() {
    if (!this.authService.userData) {
      this.appSettingService.showSnackBar('You need to login first');
    }
    this.spinner.show();
    this.channelService
      .subscribeToChannel(this.channelId, !this.channelDetails.isSubscribed)
      .subscribe(
        (data) => {
          this.channelDetails.isSubscribed = !this.channelDetails.isSubscribed;
          this.channelDetails.subscriptions += this.channelDetails.isSubscribed
            ? 1
            : -1;
          this.appSettingService.showSnackBar(
            `${this.channelDetails.isSubscribed ? 'Subscribed' : 'Unsubscribed'} to ${this.channelDetails.title} successfully`,
          );
        },
        (err) => {
          console.log(
            '🚀 ~ ChannelComponent ~ this.channelService.subscribeToChannel ~ err:',
            err,
          );
          this.spinner.hide();
          this.appSettingService.showSnackBar(err.error.data);
        },
        () => this.spinner.hide(),
      );
  }
}
export const routes: Routes = [{ path: '', component: ChannelComponent }];
