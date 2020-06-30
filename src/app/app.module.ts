import { BrowserModule }                    from '@angular/platform-browser';
import { HttpClientModule }                 from "@angular/common/http";
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule }                         from '@angular/core';

import { MatTableModule }           from "@angular/material/table";
import { MatPaginatorModule }       from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule }           from "@angular/material/input";
import { MatSelectModule }          from "@angular/material/select";
import { MatButtonModule }          from "@angular/material/button";
import { MatIconModule }            from "@angular/material/icon";
import { MatCardModule }            from "@angular/material/card";
import { MatMenuModule }            from "@angular/material/menu";

import { AppRoutingModule }     from './app-routing.module';
import { AppComponent }         from "./app.component";
import { MatSidenavModule }     from "@angular/material/sidenav";
import { MatListModule }        from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
