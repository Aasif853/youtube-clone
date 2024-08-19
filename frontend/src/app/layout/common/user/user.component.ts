import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import {
  GoogleSigninButtonModule,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from "@abacritt/angularx-social-login";
import { MatButton } from "@angular/material/button";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { User } from "../../../types/interfaces";
import { AppSettingService } from "../../../service/appSetting.service";
import { takeUntil } from "rxjs";
import { AuthService } from "../../../service/auth.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, GoogleSigninButtonModule],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit {
  @ViewChild("userOrigin") private _userOrigin!: ElementRef;
  @ViewChild("userPanel")
  private _userPanel!: TemplateRef<any>;
  user!: User | null;
  socialUser!: SocialUser;
  isUserValidated: boolean = false;
  private _overlayRef!: OverlayRef;

  socialAuthService = inject(SocialAuthService);
  authService = inject(AuthService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  appSettingService = inject(AppSettingService);

  ngOnInit() {
    this.appSettingService.user$.subscribe((user) => {
      this.isUserValidated = true;
      this.user = user;
      console.log("LoggedUser", user);
      this._changeDetectorRef.markForCheck();
    });
    this.socialAuthService.authState.subscribe((user) => {
      console.log(
        "🚀 ~ AppComponent ~ this.socialAuthService.authState.subscribe ~ user:",
        user,
      );
      this.socialUser = user;
      if (user) this.signIn(user);
    });
  }
  closePanel() {}
  signInWithGoogle(): void {
    console.log("sinincallsed");
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((x) => console.log(x));
  }

  signIn(data: SocialUser) {
    const params: User = {
      name: data.name,
      email: data.email,
      username: data.name,
      photoUrl: data.photoUrl,
      googleId: data.id,
      googleToken: data.idToken,
    };
    this.authService.signInUser(params).subscribe(
      (data) => {
        console.log("Userdata", data);
        this.appSettingService.user = data.user;
        this.appSettingService.accessToken = data.user.token;
      },
      (err) => {
        console.log("error", err);
      },
    );
  }
  signOut() {
    this.appSettingService.accessToken = "";
    this.appSettingService.removeLocalStoreUser();
    this.appSettingService.user = null;
    this.socialAuthService.signOut();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open the notifications panel
   */
  openPanel(): void {
    console.log("onCLIck", this._userOrigin);
    // Return if the notifications panel or its origin is not defined
    if (!this._userPanel || !this._userOrigin) {
      return;
    }
    console.log("onCLIck");
    // Create the overlay if it doesn't exist
    if (!this._overlayRef) {
      this._createOverlay();
      console.log("onCLIck");
    }

    // Attach the portal to the overlay
    this._overlayRef.attach(
      new TemplatePortal(this._userPanel, this._viewContainerRef),
    );
  }

  /**
   * Create the overlay
   */
  private _createOverlay(): void {
    // Create the overlay
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: "fuse-backdrop-on-mobile",
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._userOrigin.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
          },
          {
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
          },
          {
            originX: "end",
            originY: "bottom",
            overlayX: "end",
            overlayY: "top",
          },
          {
            originX: "end",
            originY: "top",
            overlayX: "end",
            overlayY: "bottom",
          },
        ]),
    });

    // Detach the overlay from the portal on backdrop click
    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }
}
