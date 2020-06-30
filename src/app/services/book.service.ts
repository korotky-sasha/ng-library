import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { SearchResult } from "../shared/models";
import { environment }  from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = environment.baseUrl;
  googleBookUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(
    public http: HttpClient
  ) { }

  search(question: string, maxResults: number, page: number = 1, mode: string = 'q'): Observable<SearchResult> {
    return this.http.get(
      this.baseUrl,
      {params: {[mode]: question, limit: maxResults.toString(), offset: (maxResults * (page - 1)).toString()}})
      .pipe(
        map(value => {
          const result: SearchResult = {numFound: 0, docs: []};
          if(value) {
            result.numFound = value["numFound"];
            result.docs = value["docs"];
          }
          return result;
        })
      );
  }

  checkBookPreview(googleId: string) {
    return this.http.get(
      this.googleBookUrl + '/' + googleId);
  }
}
