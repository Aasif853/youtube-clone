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

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, SharedModule, GoogleSigninButtonModule],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit {
  @ViewChild("userOrigin") private _userOrigin!: ElementRef;
  @ViewChild("userPanel")
  private _userPanel!: TemplateRef<any>;
  user!: User | null;
  socialUser!: SocialUser;
  loggedIn: boolean = false;
  private _overlayRef!: OverlayRef;

  authService = inject(SocialAuthService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  private appSettingService = inject(AppSettingService);

  ngOnInit() {
    this.appSettingService.user$.subscribe((user) => {
      this.user = user;
      console.log("LoggedUser", user);
      this._changeDetectorRef.markForCheck();
    });
    this.authService.authState.subscribe((user) => {
      console.log(
        "🚀 ~ AppComponent ~ this.authService.authState.subscribe ~ user:",
        user,
      );
      this.socialUser = user;
      if (user)
        this.appSettingService.user = { id: +user.id, email: user.email };
      this.loggedIn = user != null;
    });
  }
  closePanel() {}
  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((x) => console.log(x));
  }

  signIn() {}
  signOut() {
    this.authService.signOut();
    this.appSettingService.removeLocalStoreUser();
    this.appSettingService.getLocalStorageUser();
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
