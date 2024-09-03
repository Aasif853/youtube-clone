import { Component, inject, Input, OnInit } from '@angular/core';
import { CardComponent } from '../../layout/common/card/card.component';
import { VideoService } from '../../service/video.service';

import { CategoryComponent } from '../../layout/common/category/category.component';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { InfiniteScrollComponent } from '../../shared/infinit-scroll.component';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [InfiniteScrollComponent, CardComponent, CategoryComponent],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
})
export class ListingComponent implements OnInit {
  @Input() showCategory = true;
  @Input() chennelId = '';

  videoArray: any[] = [];
  videoService = inject(VideoService);
  totalPage = 0;
  filters: {
    paginator$: BehaviorSubject<number>;
    query$: BehaviorSubject<string>;
    sort$: BehaviorSubject<string>;
  } = {
    paginator$: new BehaviorSubject(1),
    query$: new BehaviorSubject(''),
    sort$: new BehaviorSubject('popularity.desc'),
  };
  loading = true;
  sub!: Subscription;
  ngOnInit(): void {
    this.sub = combineLatest([
      this.filters.paginator$.pipe(startWith(1), distinctUntilChanged()),
      this.filters.query$.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        tap((val) => {
          this.filters.paginator$.next(1);
          this.videoArray = [];
        }),
      ),
      this.filters.sort$.pipe(
        startWith(''),
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
          console.log("🚀 ~ ListingComponent ~ map ~ data:", data)
          this.loading = true;
          let filter: any = { where: {} };
          if (this.chennelId) {
            filter.where['channelId'] = this.chennelId;
          }
          return { pageNumber: data[0] || 0, pageSize: 24, queryString: data[1], sortOrder: data[2], filter };
        }),
      )
      .subscribe((params) => {
        console.log("🚀 ~ ListingComponent ~ .subscribe ~ params:", params)
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
    console.log('onscolled');
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
