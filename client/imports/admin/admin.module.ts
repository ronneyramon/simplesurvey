import { NgModule, } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SurveyComponent } from './survey/survey';
import { BrowserModule } from "@angular/platform-browser";
import { SurveyEditorComponent } from "./survey/survey.editor.component";
import { LayoutComponent } from "./layout/layout";

const appRoutes: Routes = [
    {
        path: 'admin',
        component: LayoutComponent,
        children: [
            { path: 'survey/:id', component: SurveyComponent }
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        LayoutComponent,
        SurveyComponent,
        SurveyEditorComponent
    ]

})
export class AdminModule {
    constructor() {

    }
}
