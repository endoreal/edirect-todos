import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { LoaderState } from './loader.interface';

@Injectable()
export class LoaderService {
  public LoaderNotification = new BehaviorSubject<LoaderState>({ show: false, backdrop: false });

  private callCount = 0;

  private backdrop = false;

  constructor() {}

  increaseCallCount() {

    this.callCount = this.callCount + 1;

    if (this.callCount > 0) {
      setTimeout(() => {
        this.LoaderNotification.next({ show: true, backdrop: this.backdrop });
      });
    }
  }

  decreaseCallCount() {

    this.callCount = this.callCount - 1;

    if (this.callCount <= 0) {
      setTimeout(() => {
        this.LoaderNotification.next({ show: false, backdrop: this.backdrop });
      });
    }
  }

  activate() {

    this.increaseCallCount();
  }

  dismiss(force: boolean = false) {

    if (force) {

      this.callCount = 0;

      setTimeout(() => {
        this.LoaderNotification.next({ show: false, backdrop: this.backdrop });
      });

    } else {

      this.decreaseCallCount();
    }
  }

  setBackdropVisibility(visible: boolean) {

    this.backdrop = visible;
  }
}
