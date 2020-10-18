import { NgModule, Type } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';

import { ShellComponent } from './shell.component';

/**
 * COMPONENTS
 */
/* import { SidenavBarComponent } from './components/sidenav/sidenav-bar/sidenav-bar.component'; */

const COMPONENTS: Type<any>[] = [

];

/**
 * ENTRY COMPONENTS
 */
// import { Something } from './somewhere';

const ENTRYCOMPONENTS: Type<any>[] = [];

@NgModule({
  imports: [
    SharedModule
  ],
  entryComponents: [
    ...ENTRYCOMPONENTS
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRYCOMPONENTS,
    ShellComponent,
  ],
  providers: [

  ],
})
export class ShellModule {}
