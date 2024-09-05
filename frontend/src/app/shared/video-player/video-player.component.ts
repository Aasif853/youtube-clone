import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import Hls from 'hls.js';
import videojs from 'video.js';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() video: any;
  private hls!: Hls;
  @ViewChild('videoPlayer', { static: true })
  videoPlayer!: ElementRef<HTMLVideoElement>;

  player: any;
  public videoSrc!: string;
  // 'assets/videos/1766d173-dab2-435d-9b56-d9ef388daca7/VideoPlayback_mp4_master.m3u8';

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.player && changes['video']) {
      this.player.src({
        src: this.videoSourceUrl,
        type: 'application/x-mpegURL',
      });
      // this.player.play();
    }
  }
  get videoSourceUrl() {
    return `${environment.awsMediaUrl}/${this.video.id}/${this.video.file_key}_master.m3u8`;
  }
  initPlayer(): void {
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
