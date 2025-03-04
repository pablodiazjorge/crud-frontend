import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookWithImageDTO } from '../models/book';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/book';

  constructor(private http: HttpClient) { }

  getBooks(page: number = 0, size: number = 10, query?: string, sortBy: string = 'title', sortDirection: string = 'ASC'): Observable<Page<BookWithImageDTO>> {
    let url = `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    if (query && query.trim() !== '') {
      url += `&query=${encodeURIComponent(query)}`;
    }
    return this.http.get<Page<BookWithImageDTO>>(url);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book, image: File): Observable<Book> {
    const formData = new FormData()
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    //formData.append("book", JSON.stringify(book));
    formData.append('file', image)

    return this.http.post<Book>(this.apiUrl, formData);
  }

  updateBook(book: Book) {
    return this.http.put(this.apiUrl, book);
  }

  deleteBook(id: number) {
    return this.http.delete<Book>(`${this.apiUrl}/${id}`);
  }

  updateBookImage(id: number, image: File): Observable<Book> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.put<Book>(`${this.apiUrl}/${id}/image`, formData);
  }
}
