import { Component, OnInit } from '@angular/core';
import { Attraction, ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  allAttractions: Attraction[] = [];
  displayedAttractions: Attraction[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.listService.getAttractions().subscribe(res => {
      this.allAttractions = res.data;
      this.updatePage();
    });
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedAttractions = this.allAttractions.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.allAttractions.length / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.updatePage();
    }
  }

}
