import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [ButtonModule, CardModule, RouterModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent {
  books: Book[] = []

  constructor(private bookService: BookService) { }

  ngOnInit(): void {

  }

  getAllBooks() {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;
    });
  }
}
