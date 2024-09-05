import { Component, inject, OnInit } from '@angular/core';
import { VideoService } from '../../service/video.service';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from '../../shared/video-player/video-player.component';
import { AppSettingService } from '../../service/appSetting.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [VideoPlayerComponent, NgOptimizedImage],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit {
  video: any = {};
  videoId!: number;
  videoService = inject(VideoService);
  route = inject(ActivatedRoute);
  appSettingService = inject(AppSettingService)
  ngOnInit(): void {
    this.route.params.subscribe((route) => {
      this.videoId = route['id'];
      if (this.videoId) {
      this.getVideo();
      }
    });
  }

  getVideo() {
    this.videoService
      .getSingleVideo(this.videoId)
      .subscribe((data) => (this.video = data));
  }
}
