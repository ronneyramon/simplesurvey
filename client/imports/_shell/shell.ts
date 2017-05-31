import { Component } from "@angular/core";
import template from "./shell.html";
import style from "./shell.scss";

@Component({
  selector: "shell",
  template,
  styles: [ style ]
})
export class ShellComponent {
  constructor() {
  }
}
