import { NgOptimizedImage, provideImgixLoader } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  providers: [provideImgixLoader(environment.mediaUrl)],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
})
export class CardComponent {
  @Input() video: any;
}
