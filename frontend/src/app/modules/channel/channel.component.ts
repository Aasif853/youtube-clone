import { Component, ViewEncapsulation } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ListingComponent } from "../listing/listing.component";

@Component({
  selector: "app-channel",
  standalone: true,
  imports: [SharedModule, ListingComponent],
  templateUrl: "./channel.component.html",
  styleUrl: "./channel.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class ChannelComponent {}
