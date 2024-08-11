import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../layout/common/card/card.component';
import { VideoService } from '../../service/video.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
})
export class ListingComponent implements OnInit {
  videoArray = [];

  constructor(private videoService: VideoService) {}
  ngOnInit(): void {
    this.getVideos();
  }

  getVideos() {
    this.videoService.getVideosListing().subscribe((data) => {
      this.videoArray = data;
    });
  }
}
