export interface Article {
  source: ArticleSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
  cacheTime?: Date;
  saveFlag?: number;
  country?: string;
  id?: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface ApiKey {
  name: string;
  key: string;
}

export interface ArticleSource {
  id: string;
  name: string;
}
