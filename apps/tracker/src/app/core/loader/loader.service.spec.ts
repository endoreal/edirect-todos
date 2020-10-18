import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });

    loaderService = TestBed.inject(LoaderService);

    loaderService.dismiss(true);
  });

  it('should be created', () => {
    expect(loaderService).toBeTruthy();
  });

  describe('activate', () => {
    it('should show loader', fakeAsync(() => {
      loaderService.setBackdropVisibility(true);

      loaderService.activate();

      tick(100);

      loaderService.LoaderNotification.subscribe((notification) => {
        expect(notification.show).toBeTruthy();
        expect(notification.backdrop).toBeTruthy();
      });
    }));

    it('should hide loader', fakeAsync(() => {
      loaderService.activate();

      tick(100);

      loaderService.dismiss();
      loaderService.dismiss(true);

      tick(100);

      loaderService.LoaderNotification.subscribe((notification) => {
        expect(notification.show).toBeFalsy();
      });
    }));

    it('should keep loader', fakeAsync(() => {
      loaderService.increaseCallCount();
      loaderService.increaseCallCount();

      loaderService.decreaseCallCount();

      tick(100);

      loaderService.LoaderNotification.subscribe((notification) => {
        expect(notification.show).toBeTruthy();
      });
    }));

    it('should not show loader', fakeAsync(() => {
      loaderService.decreaseCallCount();
      loaderService.decreaseCallCount();

      loaderService.increaseCallCount();

      tick(100);

      loaderService.LoaderNotification.subscribe((notification) => {
        expect(notification.show).toBeFalsy();
      });
    }));
  });
});
