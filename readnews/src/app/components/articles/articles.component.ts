import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/models.interface';
import { dbSvc } from 'src/app/services/db.service';
import { newsAPI } from 'src/app/services/news.services';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
})
export class ArticlesComponent implements OnInit {
  constructor(
    private newsAPI: newsAPI,
    private actRoute: ActivatedRoute,
    private db: dbSvc
  ) {}

  articles: Article[];
  cc: string;

  ngOnInit(): void {
    //get articles from db
    this.cc = this.actRoute.snapshot.params['cc'];
    this.loadArticles().then((res) => (this.articles = res));
  }

  async loadArticles(): Promise<Article[]> {
    if (
      (await this.db.haveArticles(this.cc)) &&
      !(await this.db.checkCache(this.cc))
    ) {
      //cache invalid and deleted, refresh cache
      await this.fetchAndStoreArticles();
    } else {
      //fetch articles
      await this.fetchAndStoreArticles();
    }
    //return articles from db
    return await this.db.getArticles(this.cc);
  }

  async fetchAndStoreArticles() {
    const articles = await this.newsAPI.getNews(this.cc);
    //load in caching properties
    articles.forEach((article) => {
      article.country = this.cc;
      article.saveFlag = 0;
      article.cacheTime = new Date();
    });
    //push to DB
    this.db.saveArticles(articles);
  }
}
