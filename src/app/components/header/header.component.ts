import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/common/auth.service';
import { FetchApiService } from 'src/app/common/fetch-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticatedSubscription!: Subscription;

  constructor(public authService: AuthService, private fetchApiService: FetchApiService) { }

  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.authService.isAuthenticated$.pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          const token = this.authService.Token;
          return this.fetchApiService.getUserInformation(token!);
        } else {
          return of(null);
        }
      })
    ).subscribe((data) => {
      if (data) {
        this.authService.saveNameOnStorage(data.name);
      }
    });
  }

  ngOnDestroy(): void {
    this.isAuthenticatedSubscription?.unsubscribe();
  }

  clearToken() {
    this.authService.removeTokenFromStorage();
    this.authService.checkIsAuthenticated();
    this.authService.removeNameFromStorage();
  }

}
