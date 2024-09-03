import { Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable, Subject } from 'rxjs';
import { concatMap, scan, takeUntil, tap } from 'rxjs/operators';
import { UploaderService } from '../../service/uploader.service';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'download-pogress-dialog',
  templateUrl: './download-progress.component.html',
  standalone: true,
  imports: [SharedModule, CommonModule],
  styleUrl: './download-progress.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DownloadProgressDialogComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  progress: number = 0;
  isCompleted: boolean = false;
  fileName: any;
  uploaderServcie = inject(UploaderService);
  public myControl = new FormControl('', Validators.required);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DownloadProgressDialogComponent>,
  ) {}

  ngOnInit(): void {
    const chunData = this.data.chunData as Array<FormData>;
    const length = this.data.length;
    let rowLength = 0;
    from(chunData)
      .pipe(
        concatMap((ev) => this.uploaderServcie.chunkUpload(ev)),
        takeUntil(this._unsubscribeAll),
        tap((data: any) => (rowLength += 1)),
      )
      .subscribe((datas) => {
        rowLength = rowLength || datas.length;
        this.progress = (rowLength / length) * 100;
        if (this.progress === 100 && rowLength) {
          this.dialogRef.close(true);
          // this.isCompleted = true;
        }
        /* this.generatePDF(datas); */
      });
  }
  public hasError = (control: FormControl, errorName: string) => {
    return control.hasError(errorName);
  };

  onGenerate(action: any) {}
  onCancel() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
