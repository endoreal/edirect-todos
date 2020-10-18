import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inline-loader',
  template: `
    <nz-spin [nzSpinning]="isLoading" [nzIndicator]="indicatorTemplate">
      <ng-content></ng-content>
    </nz-spin>
    <ng-template #indicatorTemplate>
      <i aria-hidden="true" class="custom-spin" [style.font-size.rem]="size" nz-icon [nzType]="'sync'" [nzSpin]="true"></i>
    </ng-template>
  `,
  styles: [
    `
      .custom-spin {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `
  ],
})
export class InlineLoaderComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() size = 3;

  constructor() {}

  ngOnInit() {}
}
