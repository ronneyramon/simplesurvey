import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
import { ShellComponent } from "./shell";
import { AdminModule } from "./../admin/admin.module";
import { ResponseModule } from "../response/response.module";

const shellRoutes: Routes = [
  // { path: '', redirectTo: 'admin/surveys', pathMatch: 'full' }
];

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    ShellComponent
  ],
  // Entry Components
  entryComponents: [
    ShellComponent
  ],
  // Modules
  imports: [
    BrowserModule,
    AdminModule,
    ResponseModule,
    RouterModule.forRoot(shellRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
  ],
  // Main Component
  bootstrap: [ShellComponent]
})
export class ShellModule {
  constructor() {

  }
}
