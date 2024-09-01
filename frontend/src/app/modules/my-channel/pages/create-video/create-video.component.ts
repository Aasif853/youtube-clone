import { Component, ViewEncapsulation } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";
import { UploadComponent } from "../uploader/uploader.component";

@Component({
  selector: "app-create-video",
  standalone: true,
  imports: [SharedModule, UploadComponent],
  templateUrl: "./create-video.component.html",
  styleUrl: "./create-video.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreateVideoComponent {}
