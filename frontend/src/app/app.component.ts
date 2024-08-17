import { Component, inject, OnInit } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterModule, SharedModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "frontend";
  authService = inject(SocialAuthService);
  user!: SocialUser;
  ngOnInit() {}
}
