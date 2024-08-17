import { Component, inject, OnInit } from "@angular/core";
import { CardComponent } from "../../layout/common/card/card.component";
import { VideoService } from "../../service/video.service";
import { CommonModule } from "@angular/common";
import { CategoryComponent } from "../../layout/common/category/category.component";

@Component({
  selector: "app-listing",
  standalone: true,
  imports: [CommonModule, CardComponent, CategoryComponent],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent implements OnInit {
  videoArray = [];
  videoService = inject(VideoService);

  ngOnInit(): void {
    this.getVideos();
  }

  getVideos() {
    this.videoService.getVideosListing().subscribe((data) => {
      this.videoArray = data;
    });
  }
}
