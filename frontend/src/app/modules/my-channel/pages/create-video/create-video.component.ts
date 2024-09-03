import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { UploadComponent } from '../uploader/uploader.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChannelService } from '../../../../service/channel.service';
import { AppSettingService } from '../../../../service/appSetting.service';
import { title } from 'process';
import { UploaderService } from '../../../../service/uploader.service';
import { concatMap, from, merge, Subject, takeUntil, tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadProgressDialogComponent } from '../../../../shared/download-progress/download-progress.component';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks
@Component({
  selector: 'app-create-video',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, UploadComponent],
  templateUrl: './create-video.component.html',
  styleUrl: './create-video.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreateVideoComponent {
  @ViewChild(UploadComponent) uploadComponent!: UploadComponent;
  uploaderServcie = inject(UploaderService);
  appSettingService = inject(AppSettingService);
  _matDialog = inject(MatDialog);
  videoForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  progress: number = 0;
  isCompleted: boolean = false;
  onUpload() {
    if (this.videoForm.invalid) {
      this.videoForm.markAsTouched();
      this.appSettingService.openSnackBar('Please fill the rquired details');
      return;
    }

    if (!this.uploadComponent.videoFile) {
      this.appSettingService.openSnackBar('Please select the vidoe file');
      return;
    }
    if (!this.uploadComponent.imageFile) {
      this.appSettingService.openSnackBar('Please select the thumnail');
      return;
    }
    this.initializeUpload();
  }

  initializeUpload() {
    const selectedFile = this.uploadComponent.videoFile;

    if (!selectedFile) {
      return;
    }
    const params = {
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      totalChunks: this.totalChunks,
    };
    console.log(
      '🚀 ~ CreateVideoComponent ~ initializeUpload ~ params:',
      params,
    );

    this.uploaderServcie.initializeUpload(params).subscribe((resp) => {
      console.log(
        '🚀 ~ CreateVideoComponent ~ this.uploaderServcie.initializeUpload ~ resp:',
        resp,
      );
      const uploaderId = resp.data.uploadId;

      this.handleFileChuncking(uploaderId, selectedFile);
    });
  }

  open(config: any): MatDialogRef<DownloadProgressDialogComponent> {
    // Merge the user config with the default config

    // Open the dialog
    return this._matDialog.open(DownloadProgressDialogComponent, {
      autoFocus: true,
      disableClose: true,
      data: config,
      panelClass: 'fuse-confirmation-dialog-panel',
    });
  }
  handleFileChuncking(uploaderId: string, selectedFile: File) {
    let start = 0;
    const chunkParams = [];
    for (let chunkIndex = 0; chunkIndex < this.totalChunks; chunkIndex++) {
      const chunk = selectedFile.slice(start, start + CHUNK_SIZE);
      start += CHUNK_SIZE;
      const chunkFormData = new FormData();
      chunkFormData.append('uploadId', uploaderId);
      chunkFormData.append('chunkData', chunk);
      chunkFormData.append('chunkIndex', chunkIndex.toString());
      chunkParams.push(chunkFormData);
    }
    this.open({ chunData: chunkParams, length: chunkParams.length })
      .afterClosed()
      .subscribe((data) => {
        console.log('🚀 ~ CreateVideoComponent ~ .subscribe ~ data:', data);
        if (data) {
          this.completeUpload(uploaderId);
        }
      });
  }

  completeUpload(uploaderId: string) {
    const value = this.videoForm.value;

    if (!this.uploadComponent.imageFile) {
      return;
    }
    const formData = new FormData();
    formData.append('uploadId', uploaderId);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('thumbnail', this.uploadComponent.imageFile);

    this.uploaderServcie.completeUpload(formData).subscribe((resp) => {
      console.log(
        '🚀 ~ CreateVideoComponent ~ this.uploaderServcie.completeUpload ~ data:',
        resp,
      );
      this.appSettingService.openSnackBar(resp.message);
      // this.onClear();
    });
  }

  onClear() {
    this.videoForm.reset();
    this.uploadComponent.handleRemovesFile();
    this.uploadComponent.handleRemovesThumbnail();
  }

  get totalChunks() {
    return this.uploadComponent.videoFile
      ? Math.ceil(this.uploadComponent.videoFile?.size / CHUNK_SIZE)
      : 0;
  }
}
