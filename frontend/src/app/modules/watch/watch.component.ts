import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../layout/common/card/card.component';
import { VideoService } from '../../service/video.service';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../../layout/common/category/category.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit {
  video: any = {};
  videoId!: number;
  videoService = inject(VideoService);
  route = inject(ActivatedRoute);

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
