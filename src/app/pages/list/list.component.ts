import { Component, OnInit } from '@angular/core';
import { Attraction, ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  allAttractions: Attraction[] = [];
  filteredAttractions: Attraction[] = [];
  displayedAttractions: Attraction[] = [];
  currentPage = 1;
  pageSize = 10;

  // 分類編號
  selectedCategoryId: number = 0;
  categoryList = [
    { id: 0, name: '全部' },
    { id: 13, name: '歷史建築' },
    { id: 15, name: '藝文館所' },
    { id: 16, name: '戶外踏青' },
    { id: 18, name: '公共藝術' },
    { id: 19, name: '親子共遊' },
    { id: 20, name: '北北基景點' },
    { id: 23, name: '觀光夜市' },
    { id: 24, name: '主題商街' },
    { id: 25, name: '無障礙旅遊推薦景點' },
    { id: 499, name: '其他' }
  ];
 

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.listService.getAttractions().subscribe(res => {
      this.allAttractions = res.data;
      this.filteredAttractions = res.data;
      this.updatePage();
    });
  }

  updatePage(): void {
    const data = this.filteredAttractions;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedAttractions = data.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.filteredAttractions.length / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.updatePage();
    }
  }

  get maxPage(): number {
    return Math.ceil(this.filteredAttractions.length / this.pageSize);
  }

  onCategoryChange() {
    if (this.selectedCategoryId === 0) {
      this.filteredAttractions = this.allAttractions;
    } else {
      this.filteredAttractions = this.allAttractions.filter(
        a => a.category?.some(c => c.id === this.selectedCategoryId)
      );
    }
    this.currentPage = 1;
    this.updatePage();
  }

}
