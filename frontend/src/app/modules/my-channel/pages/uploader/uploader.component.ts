import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';

const ALLOWED_FILE_TYPES = [
  'video/mp4',
  'video/3gpp',
  'video/mkv',
  'video/webm',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-msvideo',
  'video/mpeg',
  'video/dvd',
  'video/xvid',
  'video/x-flv',
  'video/x-f4v',
  'video/divx',
];

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UploadComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('thumbnailInput', { static: false }) thumbnailInput!: ElementRef;
  @ViewChild('video', { static: false }) video!: ElementRef;
  @ViewChild('image', { static: false }) image!: ElementRef;

  allowedFileTypes = ALLOWED_FILE_TYPES;

  isUploading = false;
  fileUrl!: string | null;
  imgUrl!: string | null;
  videoFile!: File | null;
  imageFile!: File | null;

  handleChange(event: any) {
    const file = event.target.files[0] as File;
    this.fileUrl = URL.createObjectURL(file);
    this.videoFile = file;
    console.log(
      '🚀 ~ UploadComponent ~ generateVideoThumbnail ~ generateVideoThumbnail:',
      this.video,
    );
  }

  handleImageChange(event: any) {
    const file = event.target.files[0] as File;
    this.imgUrl = URL.createObjectURL(file);
    this.imageFile = file;
  }

  handleRemovesFile() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.videoFile = null;
    this.fileUrl = null;
  }

  handleRemovesThumbnail() {
    if (this.thumbnailInput && this.thumbnailInput.nativeElement) {
      this.thumbnailInput.nativeElement.value = null;
    }

    this.imageFile = null;
    this.imgUrl = null;
  }

  handlevideoFile() {
    // logic to upload file
  }

  generateVideoThumbnail(file: File) {
    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;
    ctx?.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
    var image = canvas.toDataURL('image/jpeg', 0.95);
    console.log('🚀 ~ UploadComponent ~ snapImage ~ image:', image);
  }

  snapImage(video: any) {
    console.log(this.video);
    let canvas = document.createElement('canvas');

    let context = canvas.getContext('2d');
    context?.drawImage(
      this.video.nativeElement,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    var image = canvas.toDataURL('image/jpeg', 0.95);
    console.log('🚀 ~ UploadComponent ~ snapImage ~ image:', image);
    // this.fileUrl = image;
  }
}
