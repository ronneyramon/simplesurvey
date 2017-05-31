import { NgModule, } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ResponseComponent } from './response';
import { BrowserModule } from "@angular/platform-browser";

const routes: Routes = [
    {
        path: 'response',
        children: [
            { path: ':id', component: ResponseComponent }
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        ResponseComponent
    ],
    exports: [

    ]
})
export class ResponseModule {
    constructor() {

    }
}
