import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule, DOCUMENT } from '@angular/common';
import Hls from 'hls.js';
import { environment } from '../../../environments/environment.development';
import { debounceTime, filter, fromEvent, Subject, takeUntil, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

const ALLOWER_KEY = [
  ' ',
  'k',
  'f',
  't',
  'i',
  'm',
  'arrowright',
  'arrowleft',
  'arrowup',
  'arrowdown',
];
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('actionIcon', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.5)' }),
        animate('100ms', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        // style({ opacity: 1, transform: 'scale(1.5)' }),
        animate('300ms', style({ opacity: 0, transform: 'scale(1.5)' })),
      ]),
    ]),
  ],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() video: any;
  @ViewChild('videoPlayer', { static: true })
  videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('timeLineContainer', { static: true })
  timeLineContainer!: ElementRef;

  @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    if (this.isScrubbing) {
      this.toggleScrubbing(event);
    }
  }
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const tagName = this.document.activeElement?.tagName.toLowerCase() ?? '';

    if (tagName == 'input') return;

    if (ALLOWER_KEY.includes(key)) {
      event.preventDefault();
      this.onKeyboardEventTrigger(key, tagName);
    }
    // Do something with the volume value
  }
  player: any;
  private _document: any = Inject(DOCUMENT);

  hlsPlayer!: Hls;
  plyr: any;
  public videoSrc!: string;

  public currentTime: string = '';
  public totalTime: string = '';
  public playbackSpeed: string = '1x';
  public fragmentPercent: number = 0;
  public playedPercent: number = 0;
  public theaterMode: Boolean = false;
  public isScrubbing: Boolean = false;
  public isBuffering: Boolean = true;
  public isFragmentLoading: Boolean = true;
  public wasPlaying: Boolean = false;
  public animationState: Boolean = false;
  public pictureInPicture: Boolean = false;
  // 'assets/videos/1766d173-dab2-435d-9b56-d9ef388daca7/VideoPlayback_mp4_master.m3u8';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initHLSPlayer();
  }
  animate() {
    this.animationState = true;
    setTimeout(() => {
      this.animationState = false;
    }, 100);
  }
  onKeyboardEventTrigger(key: string, tagName: string) {
    switch (key) {
      case ' ':
      case 'k':
        if (tagName == 'button') return;
        this.togglePlay();
        break;
      case 'f':
        this.toggleTheaterMode();
        break;
      case 'i':
        this.toggleMiniPlayer();
        break;
      case 'm':
        this.toggleMute();
        break;
      case 'arrowright':
        this.skipVideo(5);
        break;
      case 'arrowleft':
        this.skipVideo(-5);
        break;
      case 'arrowup':
        this.volumeIncDec(0.1);
        break;
      case 'arrowdown':
        this.volumeIncDec(-0.1);
        break;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.hlsPlayer && changes['video']) {
      this.hlsPlayer.attachMedia(this.videoPlayer.nativeElement);
    }
  }
  initHLSPlayer() {
    if (Hls.isSupported()) {
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      this.hlsPlayer = new Hls();
      this.hlsPlayer.attachMedia(this.videoPlayer.nativeElement);

      this.hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hlsPlayer.loadSource(this.videoSourceUrl);
        this.hlsPlayer.on(
          Hls.Events.MANIFEST_PARSED,
          (event: any, data: any) => {
            (window as any).hls = this.hlsPlayer;
            const availableQualities = this.hlsPlayer.levels.map(
              (l: any) => l.height,
            );
            console.log(
              '🚀 ~ VideoPlayerComponent ~ this.hlsPlayer.on ~ availableQualities:',
              availableQualities,
            );
            this.videoElement.play();
          },
        );

        this.hlsPlayer.on(Hls.Events.LEVEL_LOADED, (event: any, data: any) => {
          this.totalTime = data.details?.totalduration ?? this.video.duration;
        });

        this.hlsPlayer.on(Hls.Events.FRAG_LOADED, (event: any, data: any) => {
          const loadedData = data.frag.start + data.frag.duration;
          this.isFragmentLoading = false;
          this.fragmentPercent = loadedData / +this.totalTime;
        });

        this.hlsPlayer.on(Hls.Events.ERROR, (event: any, { details }: any) => {
          if (details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            this.isBuffering = true;
          }
        });
        this.hlsPlayer.on(Hls.Events.FRAG_BUFFERED, () => {
          this.isBuffering = false;
        });
      });
    } else {
      // default options with no quality update in case Hls is not supported
      // this.plyr = new Plyr(this.videoPlayer.nativeElement, defaultOptions);
    }
  }

  togglePlay() {
    this.animate();
    this.isPlaying ? this.videoElement.pause() : this.videoElement.play();
  }

  changePlaybackSpeed() {
    let pbRate = this.videoElement.playbackRate + 0.25;
    console.log(
      '🚀 ~ VideoPlayerComponent ~ changePlaybackSpeed ~ pbRate:',
      this.videoElement.playbackRate,
      pbRate,
    );
    if (pbRate > 2) {
      pbRate = 0.25;
    }
    this.videoElement.playbackRate = pbRate;
    this.playbackSpeed = `${pbRate}x`;
  }
  toggleTheaterMode() {
    this.theaterMode = !this.theaterMode;
    console.log(
      '🚀 ~ VideoPlayerComponent ~ toggleTheaterMode ~ theaterMode:',
      this.theaterMode,
    );
  }

  onTimelineMouseMove(event: MouseEvent) {
    const percet = this.getMouseHoverPercentage(event);
    const previewNumer = Math.max(
      1,
      Math.floor((percet * this.videoElement.duration) / 10),
    );

    if (this.isScrubbing) {
      event.preventDefault();
      this.playedPercent = percet;
    }
  }

  toggleScrubbing(event: MouseEvent) {
    const percet = this.getMouseHoverPercentage(event);

    if (this.isScrubbing) {
      this.wasPlaying = this.videoElement.paused;
      this.videoElement.pause();
    } else {
      this.videoElement.currentTime = percet * this.videoElement.duration;
      if (this.fragmentPercent < this.videoElement.currentTime) {
        this.isFragmentLoading = true;
      }
      if (!this.wasPlaying) {
        this.videoElement.play();
      }
    }

    this.onTimelineMouseMove(event);
  }
  toggleFullscreen() {
    if (this.isFullScreen) {
      this.document.exitFullscreen();
    } else {
      this.videoElement.requestFullscreen();
    }
  }

  toggleMiniPlayer() {
    if (this.isPictureInPicture) {
      this.pictureInPicture = false;
      this.document.exitPictureInPicture();
    } else {
      this.videoElement.requestPictureInPicture();
      this.pictureInPicture = true;
    }
  }

  skipVideo(duration: number) {
    this.videoElement.currentTime += duration;
  }
  volumeIncDec(value: number) {
    this.videoElement.volume += value;
    if (this.videoElement.volume > 1) {
      this.videoElement.volume = 1;
    } else if (this.videoElement.volume < 0) {
      this.videoElement.volume = 0;
    }
    this.videoElement.muted = this.videoElement.volume == 0;
  }

  toggleMute() {
    this.videoElement.muted = !this.videoElement.muted;
  }

  onVolumeSliderChange(event: any) {
    const volume = event.target['value'] ?? 1;
    this.videoElement.muted = +volume === 0;
  }

  getMouseHoverPercentage(event: MouseEvent) {
    const rect = this.timeLineContainer.nativeElement.getBoundingClientRect();
    const percet =
      Math.min(Math.max(0, event.x - rect.x), rect.width) / rect.width;
    this.isScrubbing = (event.buttons & 1) === 1;
    return percet;
  }
  get isPlaying() {
    return !this.videoElement.paused;
  }
  get isFullscreen() {
    return !this.videoElement.paused;
  }

  get isTheaterMode() {
    return this.theaterMode;
  }

  get isFullScreen() {
    return this.document.fullscreenElement ? true : false;
  }

  get isPictureInPicture() {
    return this.pictureInPicture;
  }

  get videoElement() {
    return this.videoPlayer.nativeElement;
  }

  get isMuted() {
    return this.videoElement.muted;
  }

  get isHighVolume() {
    return this.videoElement.volume > 0.5;
  }

  formatDuration(seconds: any) {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    let dur = '';
    if (hour == 0) {
      dur = `${min}:${this.leedingZeroFormatter.format(sec)}`;
    } else {
      dur = `${hour}:${this.leedingZeroFormatter.format(min)}:${this.leedingZeroFormatter.format(sec)}`;
    }
    return dur;
  }

  get leedingZeroFormatter(): Intl.NumberFormat {
    return new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
  }

  onVideoPlay(even: any) {
    this.isBuffering = false;
  }

  setCurrentTime(event: any) {
    this.currentTime = event.target.currentTime;
    this.playedPercent =
      this.videoElement.currentTime / this.videoElement.duration;
  }

  updateQuality(newQuality: any): void {
    (window as any).hls.levels.forEach((level: any, levelIndex: any) => {
      if (level.height === newQuality) {
        (window as any).hls.currentLevel = levelIndex;
      }
    });
  }

  get videoSourceUrl() {
    return `${environment.awsMediaUrl}/${this.video.id}/${this.video.file_key}_master.m3u8`;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
    }
  }
}
