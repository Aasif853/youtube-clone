import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { ListingComponent } from "./modules/listing/listing.component";
import { WatchComponent } from "./modules/watch/watch.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: ListingComponent,
        data: { reuseRoute: true },
      },
      {
        path: "watch/:id",
        component: WatchComponent,
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./modules/profile/profile.component").then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: "channel/:id",
        loadChildren: () =>
          import("./modules/channel/channel.component").then((m) => m.routes),
        // loadComponent: () =>
        //   import("./modules/channel/channel.component").then(
        //     (m) => m.ChannelComponent,
        //   ),
      },
      {
        path: "my-channel",
        loadChildren: () =>
          import("./modules/my-channel/my-channel.component").then(
            (m) => m.routes,
          ),
        // loadComponent: () =>
        //   import("./modules/channel/channel.component").then(
        //     (m) => m.ChannelComponent,
        //   ),
      },
    ],
  },
  { path: "*", redirectTo: "/" },
];
