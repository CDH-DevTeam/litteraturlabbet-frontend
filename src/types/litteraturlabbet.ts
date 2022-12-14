interface AbstractBase {
  id: number;
  created_at: string;
  updated_at: string;
  published: boolean;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<T>;
}

interface Count {
  count: number;
}

interface Author extends AbstractBase {
  gender: string;
  lbauthorid: string;
  normalized_lbauthorid: string;
  name: string;
  formatted_name: string;
  surname: string | null;
  birth_year: number;
  death_year: string | null;
}

interface Page extends AbstractBase {
  uuid: string;
  text: string;
  work: number | Work;
  number: number;
  excerpts: string;
}

interface Work extends AbstractBase {
  title: string;
  short_title: string;
  modernized_title: string;
  lbworkid: string;
  librisid: string;
  main_author: number | Author;
  edition: string;
  language: string;
  imprint_year: number;
  sort_year: number;
  word_count: number;
  authors: Array<number | Author>;
  pages: Array<number | Page>;
}

interface Cluster extends AbstractBase {
  size: number;
  segments: Array<Segment>;
}

interface Segment extends AbstractBase {
  uid: string;
  gid: string;
  bw: number;
  ew: number;
  begin: number;
  end: number;
  cluster: number | Cluster;
  page: number | Page;
  text: string;
  series: string;
}

type Litteraturlabbet = Author | Work | Page | Cluster | Segment;
type PaginatedLitteraturlabbet = Paginated<Litteraturlabbet>;

export type {
  Author,
  Work,
  Page,
  Cluster,
  Segment,
  Paginated,
  Litteraturlabbet,
  PaginatedLitteraturlabbet,
  Count,
};
