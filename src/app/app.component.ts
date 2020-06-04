import { Component, OnInit }                  from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { PageEvent } from "@angular/material/paginator";

import { BookService }       from "./services/book.service";
import { SearchResult }      from "./shared/models";
import { IMAGE_PLACEHOLDER } from "./shared/constants/image-placeholder.constant";
import { debounceTime }      from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ng-library';
  imagePlaceholderSrc = IMAGE_PLACEHOLDER;
  searchForm: FormGroup;
  searchString: string;
  searchActive: boolean;
  noSearchResult: boolean;
  searchResult: SearchResult = {
    numFound: 0,
    docs: []
  };
  pageSize = 5;
  pageNum = 1;
  pageEvent: PageEvent;
  errorMessage: string;

  constructor(
    private bookService: BookService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForms();
    this.startLiveSearch();
  }

  buildForms() {
    this.searchForm = this.formBuilder.group({
      searchString: ['', [Validators.required]],
      searchType: ['q', [Validators.required]]
    });
  }

  startLiveSearch() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(() => {
      if(this.searchForm.valid) {
        this.sendSearchRequest(this.searchForm.value.searchString);
      }
    });
  }

  sendSearchRequest(searchString?: string, pageNum = 1) {
    this.searchResult = {numFound: 0, docs: []};
    if (searchString) {
      this.searchString = searchString;
    }
    this.pageNum = pageNum;
    this.searchActive = true;
    this.noSearchResult = false;
    this.bookService.search(this.searchString, this.pageSize, this.pageNum, this.searchForm.value.searchType)
      .subscribe( value => {
        this.searchActive = false;
        this.errorMessage = null;
        if(value) {
          this.noSearchResult = !value.numFound;
        }
        if(value && value.docs && value.docs.length) {
          this.searchResult.numFound = value.numFound ? value.numFound : 0;
          value.docs.forEach((doc, index) => {
            this.searchResult.docs[index] = doc;
          });
        }
      }, error => {
        console.log(error.message);
        this.searchActive = false;
        this.errorMessage = error.message;
      });
  }

  paginatorChange(event) {
    this.pageEvent = event;
    this.pageSize = this.pageEvent.pageSize;
    this.pageNum = this.pageEvent.pageIndex + 1;
    if(this.searchResult.numFound) {
      this.sendSearchRequest(undefined, this.pageNum);
    }
  }

  showAuthorBooks(authorId: string, authorName: string) {
    this.searchForm.setValue({searchType: 'author', searchString: authorName});
    this.searchString = authorId;
    this.sendSearchRequest();
  }

  invalidImage(event) {
    event.target.src = this.imagePlaceholderSrc;
  }

  fullStar(edition_count: number) {
    return edition_count > 10;
  }
}
