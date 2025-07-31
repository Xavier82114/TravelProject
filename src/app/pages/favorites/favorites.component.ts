import { Component, OnInit } from '@angular/core';
import { Attraction, ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  allAttractions: Attraction[] = [];
  favoriteAttractions: Attraction[] = [];
  displayedAttractions: Attraction[] = [];
  pageSize = 10;
  currentPage = 1;
  favoriteIds: Set<number> = new Set();

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.listService.getAttractions().subscribe(res => {
      this.allAttractions = res.data;
      this.favoriteAttractions = this.allAttractions.filter(a => this.favoriteIds.has(a.id));
      this.updatePage();
    });
  }

  loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoriteIds = new Set(JSON.parse(stored));
    }
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedAttractions = this.favoriteAttractions.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.favoriteAttractions.length / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.updatePage();
    }
  }

  toggleFavorite(id: number): void {
    if (this.favoriteIds.has(id)) {
      this.favoriteIds.delete(id);
    } else {
      this.favoriteIds.add(id);
    }
    localStorage.setItem('favorites', JSON.stringify(Array.from(this.favoriteIds)));

    // 同步移除畫面資料
    this.favoriteAttractions = this.allAttractions.filter(a => this.favoriteIds.has(a.id));
    this.updatePage();
  }

  get maxPage(): number {
    return Math.ceil(this.favoriteAttractions.length / this.pageSize);
  }

}
