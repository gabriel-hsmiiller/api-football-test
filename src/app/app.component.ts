import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './common/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private isAuthenticatedSubscription!: Subscription;
  public showLogin = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkIsAuthenticated();

    this.isAuthenticatedSubscription = this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      this.showLogin = !isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.isAuthenticatedSubscription?.unsubscribe();
  }

}
