import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { ListingComponent } from "./modules/listing/listing.component";
import { WatchComponent } from "./modules/watch/watch.component";
import { ChannelComponent } from "./modules/channel/channel.component";
import { ProfileComponent } from "./modules/profile/profile.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: ListingComponent,
      },
      {
        path: "watch/:id",
        component: WatchComponent,
      },
      {
        path: "profile",
        component: ProfileComponent,
      },
      {
        path: "channel/:id",
        component: ChannelComponent,
      },
    ],
  },
  { path: "*", redirectTo: "/" },
];
