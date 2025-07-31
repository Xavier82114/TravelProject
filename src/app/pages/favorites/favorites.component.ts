import { Component, OnInit } from '@angular/core';
import { Attraction, ListService } from 'src/app/services/list.service';

type EditableAttraction = Attraction & {
  invalidTel?: boolean;
};
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  allAttractions: Attraction[] = [];
  favoriteAttractions: EditableAttraction[] = [];
  displayedAttractions: EditableAttraction[] = [];
  pageSize = 10;
  currentPage = 1;
  favoriteIds: Set<number> = new Set();
  editingId: number | null = null;
  selectedIds: Set<number> = new Set();  

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.listService.getAttractions().subscribe(res => {
      this.allAttractions = res.data;
      this.favoriteAttractions = this.allAttractions.filter(a => this.favoriteIds.has(a.id));
      this.applyFavoriteOverrides();
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

  validateTel(a: EditableAttraction): void {
    const chinesePattern = /[\u4e00-\u9fa5]/;
    a.invalidTel = chinesePattern.test(a.tel);
  }

  saveAttraction(a: EditableAttraction): void {
    const index = this.allAttractions.findIndex(item => item.id === a.id);
    if (index !== -1) {
      this.allAttractions[index].name = a.name;
      this.allAttractions[index].tel = a.tel;
    }

    const stored = localStorage.getItem('favoritesData');
    let favoritesData = stored ? JSON.parse(stored) : {};

    favoritesData[a.id] = {
      name: a.name,
      tel: a.tel
    };

    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));

    this.editingId = null; // 離開編輯模式
  }

  applyFavoriteOverrides(): void {
    const stored = localStorage.getItem('favoritesData');
    if (!stored) return;

    const overrides = JSON.parse(stored);
    this.favoriteAttractions.forEach(a => {
      if (overrides[a.id]) {
        a.name = overrides[a.id].name || a.name;
        a.tel = overrides[a.id].tel || a.tel;
      }
    });
  }

  toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);

    } else {
      this.selectedIds.add(id);
    }
  }

  selectAll(): void {
    const allSelected = this.displayedAttractions.every(a => this.selectedIds.has(a.id));

    if (allSelected) {
      // 目前是全選 → 全取消
      this.displayedAttractions.forEach(a => this.selectedIds.delete(a.id));
    } else {
      // 目前未全選 → 全選
      this.displayedAttractions.forEach(a => this.selectedIds.add(a.id));
    }
  }

  clearAll(): void {
    this.selectedIds.clear();
  }

  removeSelected(): void {
    // 移除收藏 id
    this.selectedIds.forEach(id => this.favoriteIds.delete(id));
    localStorage.setItem('favorites', JSON.stringify(Array.from(this.favoriteIds)));

    // 移除個別資料覆蓋（optional）
    const stored = localStorage.getItem('favoritesData');
    if (stored) {
      const overrides = JSON.parse(stored);
      this.selectedIds.forEach(id => delete overrides[id]);
      localStorage.setItem('favoritesData', JSON.stringify(overrides));
    }

    // 清除並更新畫面
    this.selectedIds.clear();
    this.favoriteAttractions = this.allAttractions.filter(a => this.favoriteIds.has(a.id));
    this.applyFavoriteOverrides();
    this.updatePage();
  }

  isAllSelected(): boolean {
    return (
      this.displayedAttractions.length > 0 &&
      this.displayedAttractions.every(a => this.selectedIds.has(a.id))
    );
  }
}
