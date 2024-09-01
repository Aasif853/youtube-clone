import { NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppSettingService } from '../../../service/appSetting.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() video: any;

  appSettingService = inject(AppSettingService);
}
