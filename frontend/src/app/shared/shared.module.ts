import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
@NgModule({
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
  ],
  exports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
  ],
})
export class SharedModule {}
