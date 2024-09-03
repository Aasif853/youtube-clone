import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent {
  private hls!: Hls;
  public videoSrc: string =
    'assets/videos/1766d173-dab2-435d-9b56-d9ef388daca7/VideoPlayback_mp4_master.m3u8';
  // 'https://codarker-youtube.s3.amazonaws.com//videos/VideoPlayback_master.m3u8';

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const video = this.elementRef.nativeElement.querySelector('video');

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.videoSrc);
      this.hls.attachMedia(video);

      let defaultOption: any = {
        controle: ['play-large', 'restart', 'rewind', 'play'],
      };
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableOption = this.hls.levels.map((i) => i.height);
        defaultOption['quality'] = {
          default: availableOption[0],
          options: availableOption,
          forced: true,
        };
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    } else {
      console.error('This browser does not support HLS');
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
