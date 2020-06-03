import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { SearchResult } from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    public http: HttpClient
  ) { }

  search(question: string, maxResults: number, page: number = 1, mode: string = 'q'): Observable<SearchResult> {
    return this.http.get(
      'http://openlibrary.org/search.json',
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
}
