import { Component, OnInit }                  from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PageEvent }                                                 from '@angular/material/paginator';
import { debounceTime, take, takeUntil, catchError, map, concatMap } from 'rxjs/operators';
import { from, of, Subject }                                         from 'rxjs';

import { BookService }       from './services/book.service';
import { SearchResult }      from './shared/models';
import { IMAGE_PLACEHOLDER } from './shared/constants/image-placeholder.constant';
import { environment }       from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ng-library';
  imagePlaceholderSrc = IMAGE_PLACEHOLDER;
  coverUrl = environment.coverUrl;
  searchForm: FormGroup;
  searchString: string;
  searchActive: boolean;
  newSearch$: Subject<boolean>;
  noSearchResult: boolean;
  searchResult: SearchResult = {
    numFound: 0,
    docs: []
  };
  pageSize = 5;
  pageNum = 1;
  pageEvent: PageEvent;
  errorMessage: string;
  previewIndicator: boolean;
  previewIndicatorValue: number;
  previewUnavailable: boolean;

  constructor(
    private bookService: BookService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.newSearch$ = new Subject();
    this.buildForms();
    this.startLiveSearch();
    this.initialSearch();
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
      if (this.searchForm.valid) {
        this.sendSearchRequest(this.searchForm.value.searchString);
      }
    });
  }

  initialSearch() {
    this.sendSearchRequest('Hobbit');
  }

  sendSearchRequest(searchString?: string, pageNum = 1) {
    this.searchResult = {numFound: 0, docs: []};
    if (searchString) {
      this.searchString = searchString;
    }
    this.pageNum = pageNum;
    this.searchActive = true;
    this.noSearchResult = false;
    this.newSearch$.next(true);
    this.bookService.search(this.searchString, this.pageSize, this.pageNum, this.searchForm.value.searchType)
      .pipe(
        take(1),
        takeUntil(this.newSearch$)
      )
      .subscribe( value => {
        this.searchActive = false;
        this.errorMessage = null;
        if (value) {
          this.noSearchResult = !value.numFound;
        }
        if (value && value.docs && value.docs.length) {
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
    if (this.searchResult.numFound) {
      this.sendSearchRequest(undefined, this.pageNum);
    }
  }

  showAuthorBooks(authorId: string, authorName: string) {
    this.searchForm.setValue({searchType: 'author', searchString: authorName}, {emitEvent: false});
    this.searchString = authorId;
    this.sendSearchRequest();
  }

  invalidImage(event) {
    event.target.src = this.imagePlaceholderSrc;
  }

  isFullStar(editionCount: number) {
    return editionCount > 10;
  }

  tryPreview(googleIds: string[]) {
    console.log(googleIds);
    if (googleIds && googleIds.length) {
      this.previewIndicator = true;
      this.previewIndicatorValue = 0;
      this.previewUnavailable = false;
      let counter = 0;
      const reqArr = googleIds.map(value => {
        return this.bookService.checkBookPreview(value);
      });

      const subscription = from(reqArr)
        .pipe(
          concatMap(value => {
            return value.pipe(
              map(value1 => {
                counter++;
                this.previewIndicatorValue = Math.floor(counter * 100 / googleIds.length);
                return value1;
              }),
              catchError(err => {
                counter++;
                this.previewIndicatorValue = Math.floor(counter * 100 / googleIds.length);
                console.log(err);
                return of(err.message);
              })
            );
          })
        )
        .subscribe(
          value => {
            if (value && value.accessInfo && value.accessInfo.embeddable && value.id) {
              this.loadBookPreview(value.id);
              this.previewIndicator = false;
              subscription.unsubscribe();
            }
          }, error => {
            console.log(error);
          }, () => {
            this.previewIndicator = false;
            this.previewUnavailable = true;
          }
        );
    }
  }

  loadBookPreview(id: string) {
    // google.books should be loaded in index.html
    // @ts-ignore
    const viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load(id);
  }
}
