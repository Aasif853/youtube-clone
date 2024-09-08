import {
  Component,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { UploadComponent } from '../uploader/uploader.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppSettingService } from '../../../../service/appSetting.service';
import { UploaderService } from '../../../../service/uploader.service';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadProgressDialogComponent } from '../../../../shared/download-progress/download-progress.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
  @Input() channelId: any;
  uploaderServcie = inject(UploaderService);
  appSettingService = inject(AppSettingService);
  spinner = inject(NgxSpinnerService);
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
      this.appSettingService.showSnackBar('Please fill the rquired details');
      return;
    }

    if (!this.uploadComponent.videoFile) {
      this.appSettingService.showSnackBar('Please select the vidoe file');
      return;
    }
    if (!this.uploadComponent.imageFile) {
      this.appSettingService.showSnackBar('Please select the thumnail');
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
    formData.append('channelId', this.channelId);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('thumbnail', this.uploadComponent.imageFile);
    this.spinner.show();
    this.uploaderServcie.completeUpload(formData).subscribe(
      (resp) => {
        console.log(
          '🚀 ~ CreateVideoComponent ~ this.uploaderServcie.completeUpload ~ data:',
          resp,
        );
        this.appSettingService.showSnackBar(resp.message);
        // this.onClear();
      },
      () => {},
      () => this.spinner.hide(),
    );
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
