import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookService } from './book.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from './error-handler.service';
import { Page } from '../models/page';
import { Book, BookWithImageDTO } from '../models/book';
import { HttpTestingController } from '@angular/common/http/testing';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let errorHandler: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ErrorHandlerService,
      ],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandler = TestBed.inject(ErrorHandlerService);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get books successfully', fakeAsync(() => {
    const mockPage: Page<BookWithImageDTO> = {
      content: [{ id: 1, title: 'Test', author: 'Author', pages: 100, price: 10, imageUrl: null, imageId: null, imageName: null, imageImageId: null }],
      pageable: { pageNumber: 0, pageSize: 10, sort: { empty: true, sorted: false, unsorted: true }, offset: 0, paged: true, unpaged: false },
      last: true,
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: true,
      numberOfElements: 1,
      empty: false,
    };

    service.getBooks(0, 10, 'test', 'title', 'ASC').subscribe((page) => {
      expect(page.content.length).toBe(1);
      expect(page.totalElements).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/book?page=0&size=10&sortBy=title&sortDirection=ASC&query=test');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
    tick();
  }));

  it('should handle error when getting books fails', fakeAsync(() => {
    spyOn(errorHandler, 'handleError');
    service.getBooks(0, 10).subscribe({
      next: () => fail('Should have failed'),
      error: (err) => expect(err).toBeTruthy(),
    });

    const req = httpMock.expectOne('http://localhost:8080/book?page=0&size=10&sortBy=title&sortDirection=ASC');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(errorHandler.handleError).toHaveBeenCalled();
  }));

  it('should create a book successfully', fakeAsync(() => {
    const mockBookInput: Book = { title: 'New Book', author: 'Author', pages: 100, price: 10 }; // id optional, omitted here
    const mockBookResponse: Book = { id: 1, title: 'New Book', author: 'Author', pages: 100, price: 10 };
    const mockFile = new File([''], 'test.jpg');

    service.createBook(mockBookInput, mockFile).subscribe((response) => {
      expect(response).toEqual(mockBookResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/book');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockBookResponse);
    tick();
  }));

  it('should update a book successfully', fakeAsync(() => {
    const mockBook: Book = { id: 1, title: 'Updated Book', author: 'Author', pages: 100, price: 10 }; // id required for update

    service.updateBook(mockBook).subscribe((response) => {
      expect(response).toEqual(mockBook);
    });

    const req = httpMock.expectOne('http://localhost:8080/book');
    expect(req.request.method).toBe('PUT');
    req.flush(mockBook);
    tick();
  }));

  it('should update book image successfully', fakeAsync(() => {
    const mockFile = new File([''], 'test.jpg');

    service.updateBookImage(1, mockFile).subscribe((response) => {
      expect(response).toBeNull(); // Assuming void return
    });

    const req = httpMock.expectOne('http://localhost:8080/book/1/image');
    expect(req.request.method).toBe('PUT');
    req.flush(null);
    tick();
  }));

  it('should delete a book successfully', fakeAsync(() => {
    service.deleteBook(1).subscribe((response) => {
      expect(response).toBeNull(); // Assuming void return
    });

    const req = httpMock.expectOne('http://localhost:8080/book/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    tick();
  }));
});