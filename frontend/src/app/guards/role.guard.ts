import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const allowedRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];

  if (!allowedRoles.length || (authService.role() && allowedRoles.includes(authService.role() as UserRole))) {
    return true;
  }

  return router.createUrlTree([authService.getDefaultRouteByRole()]);
};
