import * as jQuery from 'jquery';
window['jQuery'] = jQuery;
import "angular2-meteor-polyfills";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { ShellModule } from "./imports/_shell";

enableProdMode();

Meteor.startup(() => {
   platformBrowserDynamic().bootstrapModule(ShellModule);
});
