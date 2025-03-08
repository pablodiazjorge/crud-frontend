import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Book, BookWithImageDTO } from '../models/book';
import { Page } from '../models/page';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/book';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getBooks(page: number = 0, size: number = 10, query?: string, sortBy: string = 'title', sortDirection: string = 'ASC'): Observable<Page<BookWithImageDTO>> {
    let url = `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    if (query && query.trim() !== '') {
      url += `&query=${encodeURIComponent(query)}`;
    }
    return this.http.get<Page<BookWithImageDTO>>(url).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Not books found');
        return throwError(() => error);
      })
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Not found');
        return throwError(() => error);
      })
    );
  }

  createBook(book: Book, image: File): Observable<Book> {
    const formData = new FormData()
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    //formData.append("book", JSON.stringify(book));
    formData.append('file', image)

    return this.http.post<Book>(this.apiUrl, formData).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Check the fields and try again.');
        return throwError(() => error);
      })
    );
  }

  updateBook(book: Book) {
    return this.http.put(this.apiUrl, book).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Check the selected file and try again.');
        return throwError(() => error);
      })
    );
  }

  deleteBook(id: number) {
    return this.http.delete<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Could not delete book.');
        return throwError(() => error);
      })
    );
  }

  updateBookImage(id: number, image: File): Observable<Book> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.put<Book>(`${this.apiUrl}/${id}/image`, formData).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'Check the selected file and try again.');
        return throwError(() => error);
      })
    );
  }
}
