import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListingComponent } from '../listing/listing.component';
import { ActivatedRoute, Routes } from '@angular/router';
import { ChannelService } from '../../service/channel.service';

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
}
export const routes: Routes = [{ path: '', component: ChannelComponent }];
