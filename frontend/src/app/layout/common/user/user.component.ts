import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  GoogleSigninButtonModule,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { UserInterface } from '../../../types/interfaces';
import { AppSettingService } from '../../../service/appSetting.service';
import { AuthService } from '../../../service/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, SharedModule, GoogleSigninButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  @ViewChild('userOrigin') private _userOrigin!: ElementRef;
  @ViewChild('userPanel')
  private _userPanel!: TemplateRef<any>;
  user!: UserInterface | undefined | null;
  socialUser!: SocialUser;
  isUserValidated: boolean = false;
  private _overlayRef!: OverlayRef;

  socialAuthService = inject(SocialAuthService);
  public authService = inject(AuthService);
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  appSettingService = inject(AppSettingService);
  private router = inject(Router);

  constructor() {}
  ngOnInit() {
    this.authService.userSettings$.subscribe((data) => {
      console.log('🚀 ~ UserComponent ~ ngOnInit ~ data:', data);
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      if (user) this.signIn(user);
    });
  }
  closePanel() {}
  signInWithGoogle(): void {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((x) => console.log(x));
  }

  get userData() {
    return this.authService.userData;
  }
  signIn(data: SocialUser) {
    const params: UserInterface = {
      name: data.name,
      email: data.email,
      username: data.name,
      avatar: data.photoUrl,
      googleId: data.id,
      googleToken: data.idToken,
    };
    this.authService.signInUser(params).subscribe(
      (userData) => {
        console.log('Userdata', userData);
        this.authService.accessToken = userData.accessToken;
        this.authService.setUserSettings(userData);
      },
      (err) => {
        console.log('error', err);
      },
    );
  }

  onActionClick(action: string) {
    this._overlayRef.detach();
    switch (action) {
      case 'channel':
        this.router.navigate(['/my-channel']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'setting':
        this.router.navigate(['/profile']);
        break;
      case 'logout':
        this.signOut();
        break;
    }
  }
  signOut() {
    this.socialAuthService.signOut();
    this.authService.logout();
    this._overlayRef.detach();
    this.router.navigate(['/']);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open the notifications panel
   */
  openPanel(): void {
    console.log('onCLIck', this._userOrigin);
    // Return if the notifications panel or its origin is not defined
    if (!this._userPanel || !this._userOrigin) {
      return;
    }
    console.log('onCLIck');
    // Create the overlay if it doesn't exist
    if (!this._overlayRef) {
      this._createOverlay();
      console.log('onCLIck');
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
      backdropClass: 'fuse-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._userOrigin.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]),
    });

    // Detach the overlay from the portal on backdrop click
    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }
}
