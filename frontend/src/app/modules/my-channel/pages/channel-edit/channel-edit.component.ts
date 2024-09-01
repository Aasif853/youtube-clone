import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { UploadComponent } from '../uploader/uploader.component';
import { ChannelService } from '../../../../service/channel.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AppSettingService } from '../../../../service/appSetting.service';
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];
@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    UploadComponent,
  ],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChannelEditComponent implements OnInit, OnChanges {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @Input() channelDetails: any;
  channelService = inject(ChannelService);
  appSettingService = inject(AppSettingService);
  allowedFileTypes = ALLOWED_FILE_TYPES;
  chennalForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });
  isUploading = false;
  fileUrl!: string | null;
  uploadFile!: File | null;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['channelDetails']) {
      this.setFormValue();
    }
  }

  setFormValue() {
    this.chennalForm.patchValue({
      title: this.channelDetails?.title,
      description: this.channelDetails?.description,
      email: this.channelDetails?.email,
    });
  }

  updateChannelDetails() {
    if (this.chennalForm.invalid) {
      this.chennalForm.markAllAsTouched();
      return;
    }

    this.channelService
      .updateChangeDetails(this.channelDetails.id, this.chennalForm.value)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.channelDetails = resp.data;
          this.setFormValue();
        },
        (err) => console.log(err),
      );
  }

  handleChange(event: any, imageFor: string) {
    const file = event.target.files[0] as File;
    this.fileUrl = URL.createObjectURL(file);
    this.uploadFile = file;

    const formDat = new FormData();
    formDat.append(imageFor, file);
    this.isUploading = true;
    this.channelService
      .updateChangeImages(this.channelDetails.id, formDat)
      .subscribe(
        (resp) => {
          this.channelDetails.avatar = resp.data.avatar;
          this.channelDetails.coverImage = resp.data.coverImage;
          console.log(resp);
        },
        (err) => console.log(err),
        () => (this.isUploading = false),
      );
  }
}
