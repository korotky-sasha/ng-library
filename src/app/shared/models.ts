export interface SearchDoc {
  title_suggest: string,
  author_name: string[],
  author_key: string[],
  cover_i: number,
  first_publish_year: number,
  publisher: string[],
  edition_count: number,
  ebook_count_i: number,
  language: string[],
  key: string,
  id_google: string[],
  more: boolean
}

export interface SearchResult {
  numFound: number,
  docs: SearchDoc[]
}
