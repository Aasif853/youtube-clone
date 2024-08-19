import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
  ],
  exports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
  ],
})
export class SharedModule {}
