import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { BookWithImageDTO } from '../models/book';
import { TableModule } from 'primeng/table';
import { Page } from '../models/page';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ViewStateService } from '../services/view-state.service';


interface SortOption {
  label: string;
  sortBy: string;
  sortDirection: string;
}
@Component({
  selector: 'app-home-component',
  imports: [ButtonModule, CardModule, RouterModule, PaginatorModule, InputTextModule, FormsModule, SelectModule, TableModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent {
  books: BookWithImageDTO[] = []
  totalRecords: number = 0; // Total books
  rows: number = 10; // Books per page
  currentPage: number = 0; // Current Page (0-based)
  isDeleteInProgress: boolean = false;
  searchQuery: string = ''; // Used on filtered search
  sortOptions: SortOption[] = [
    { label: 'Title (A-Z)', sortBy: 'title', sortDirection: 'ASC' },
    { label: 'Title (Z-A)', sortBy: 'title', sortDirection: 'DESC' },
    { label: 'Author (A-Z)', sortBy: 'author', sortDirection: 'ASC' },
    { label: 'Author (Z-A)', sortBy: 'author', sortDirection: 'DESC' },
    { label: 'Pages (Low to High)', sortBy: 'pages', sortDirection: 'ASC' },
    { label: 'Pages (High to Low)', sortBy: 'pages', sortDirection: 'DESC' },
    { label: 'Price (Low to High)', sortBy: 'price', sortDirection: 'ASC' },
    { label: 'Price (High to Low)', sortBy: 'price', sortDirection: 'DESC' }
  ];
  selectedSortOption: SortOption = this.sortOptions[0];
  isCardView: boolean = true;

  constructor(
    private bookService: BookService,
    private messageService: MessageService,
    private viewStateService: ViewStateService // Inject the service
  ) {
    // Initialize isCardView from the service
    this.isCardView = this.viewStateService.getIsCardView();
  }

  toggleCardView(): void {
    this.isCardView = true;
    this.viewStateService.setIsCardView(this.isCardView);
  }

  toggleTableView(): void {
    this.isCardView = false;
    this.viewStateService.setIsCardView(this.isCardView);
  }

  ngOnInit(): void {
    this.loadBooks(this.currentPage, this.rows, this.searchQuery, this.selectedSortOption.sortBy, this.selectedSortOption.sortDirection); // Pass 0-based page to backend
  }

  /**
    * Loads books by fetching paginated data from the book service.
    * 
    * @param page The page number to load.
    * @param size The number of items per page.
  */
  loadBooks(page: number, size: number, query?: string, sortBy?: string, sortDirection?: string): void {
    this.bookService.getBooks(page, size, query, sortBy, sortDirection).subscribe((data: Page<BookWithImageDTO>) => {
      this.books = data.content;
      this.totalRecords = data.totalElements;
      this.currentPage = data.number;
      this.rows = data.size;
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.rows = event.rows;
    this.loadBooks(event.page, this.rows, this.searchQuery, this.selectedSortOption.sortBy, this.selectedSortOption.sortDirection);
  }

  searchBooks(): void {
    this.currentPage = 0; // Reset to first page
    this.loadBooks(0, this.rows, this.searchQuery, this.selectedSortOption.sortBy, this.selectedSortOption.sortDirection); // Pass 0-based page to backend
  }

  onSortChange(): void {
    this.currentPage = 0; // Reset to first page
    this.loadBooks(0, this.rows, this.searchQuery, this.selectedSortOption.sortBy, this.selectedSortOption.sortDirection); // Pass 0-based page to backend
  }

  deleteBook(id: number) {
    this.isDeleteInProgress = true;
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Book deleted',
        });
        this.isDeleteInProgress = false;
        this.loadBooks(this.currentPage, this.rows, this.searchQuery, this.selectedSortOption.sortBy, this.selectedSortOption.sortDirection);
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete book.',
        });
      },
    });
  }
}