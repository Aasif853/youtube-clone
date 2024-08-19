import { Component, inject, Input, OnInit } from "@angular/core";
import { CardComponent } from "../../layout/common/card/card.component";
import { VideoService } from "../../service/video.service";
import { CommonModule } from "@angular/common";
import { CategoryComponent } from "../../layout/common/category/category.component";
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from "rxjs/operators";
import { InfiniteScrollComponent } from "../../shared/infinit-scroll.component";

@Component({
  selector: "app-listing",
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollComponent,
    CardComponent,
    CategoryComponent,
  ],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent implements OnInit {
  @Input() showCategory = true;

  videoArray: any[] = [];
  videoService = inject(VideoService);
  totalPage = 0;
  filters: {
    paginator$: BehaviorSubject<number>;
    query$: BehaviorSubject<string>;
    sort$: BehaviorSubject<string>;
  } = {
    paginator$: new BehaviorSubject(1),
    query$: new BehaviorSubject(""),
    sort$: new BehaviorSubject("popularity.desc"),
  };
  loading = true;
  sub!: Subscription;
  ngOnInit(): void {
    this.sub = combineLatest([
      this.filters.paginator$.pipe(startWith(1), distinctUntilChanged()),
      this.filters.query$.pipe(
        startWith(""),
        debounceTime(500),
        distinctUntilChanged(),
        tap((val) => {
          this.filters.paginator$.next(1);
          this.videoArray = [];
        }),
      ),
      this.filters.sort$.pipe(
        startWith(""),
        distinctUntilChanged(),
        tap((val) => {
          this.filters.paginator$.next(1);
          this.videoArray = [];
        }),
      ),
    ])
      .pipe(
        distinctUntilChanged(),
        map((data) => {
          this.loading = true;

          return { page: data[0], query: data[1], sort_by: data[2] };
        }),
      )
      .subscribe((params) => {
        this.videoService.getVideosListing(params).subscribe((resp) => {
          this.loading = false;

          this.videoArray = [...this.videoArray, ...resp];
          this.totalPage = resp.total_pages;
        });
      });
  }

  /**
   * On select sort
   *
   */
  onSortChange(value: any) {
    this.filters.sort$.next(value);
  }

  /**
   * Load movies on scroll
   *
   */
  onScroll(): void {
    console.log("onscolled");
    const curPage = this.filters.paginator$.value;
    if (this.loading || this.totalPage == +curPage) return;

    this.filters.paginator$.next(this.filters.paginator$.value + 1);
  }

  /**
   * Filter by search query
   *
   * @param query
   */
  filterByQuery(query: string): void {
    this.filters.query$.next(query);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
