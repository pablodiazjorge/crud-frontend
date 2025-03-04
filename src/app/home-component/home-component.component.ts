import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { Book } from '../models/book';
import { Page } from '../models/page';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home-component',
  imports: [ButtonModule, CardModule, RouterModule, PaginatorModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent {
  books: Book[] = []
  totalRecords: number = 0; // Total books
  rows: number = 10; // Books per page
  currentPage: number = 0; // Current Page (0-based)
  isDeleteInProgress: boolean = false;
  constructor(
    private bookService: BookService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadBooks(this.currentPage, this.rows);
  }

  /**
    * Loads books by fetching paginated data from the book service.
    * 
    * @param page The page number to load.
    * @param size The number of items per page.
  */
  loadBooks(page: number, size: number): void {
    this.bookService.getBooks(page, size).subscribe((data: Page<Book>) => {
      this.books = data.content; // Books current page
      this.totalRecords = data.totalElements; // Total books
      this.currentPage = data.number; // Current page
      this.rows = data.size; // Size page
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page; // New page selected
    this.rows = event.rows; // New page size
    this.loadBooks(this.currentPage, this.rows);
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
        this.loadBooks(this.currentPage, this.rows); // Reload current page
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