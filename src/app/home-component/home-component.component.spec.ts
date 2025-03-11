import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponentComponent } from './home-component.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { BookService } from '../services/book.service';
import { MessageService } from 'primeng/api';
import { ViewStateService } from '../services/view-state.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Page } from '../models/page';
import { BookWithImageDTO } from '../models/book';

class MockBookService {
  getBooks = jasmine.createSpy('getBooks').and.returnValue({
    subscribe: (o: any) =>
      o.next({
        content: [{ id: 1, title: 'Test Book', author: 'Author', pages: 100, price: 10, imageUrl: null, imageId: null, imageName: null, imageImageId: null }],
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
      } as Page<BookWithImageDTO>),
  });
  deleteBook = jasmine.createSpy('deleteBook').and.returnValue({ subscribe: (o: any) => o.next() });
}

class MockMessageService {
  add = jasmine.createSpy('add');
}

class MockViewStateService {
  getIsCardView = jasmine.createSpy('getIsCardView').and.returnValue(true);
  setIsCardView = jasmine.createSpy('setIsCardView');
}

describe('HomeComponentComponent', () => {
  let component: HomeComponentComponent;
  let fixture: ComponentFixture<HomeComponentComponent>;
  let bookService: BookService;
  let messageService: MessageService;
  let viewStateService: ViewStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponentComponent,
        ButtonModule,
        CardModule,
        PaginatorModule,
        InputTextModule,
        FormsModule,
        SelectModule,
        TableModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: BookService, useClass: MockBookService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: ViewStateService, useClass: MockViewStateService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponentComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService);
    messageService = TestBed.inject(MessageService);
    viewStateService = TestBed.inject(ViewStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(bookService.getBooks).toHaveBeenCalledWith(0, 10, '', 'title', 'ASC');
    expect(component.books.length).toBe(1);
    expect(component.totalRecords).toBe(1);
  }));

  it('should delete book and reload list on success', fakeAsync(() => {
    component.deleteBook(1);
    tick();
    expect(bookService.deleteBook).toHaveBeenCalledWith(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Book deleted' });
    expect(bookService.getBooks).toHaveBeenCalledWith(0, 10, '', 'title', 'ASC');
  }));

  it('should handle error when deleting book fails', fakeAsync(() => {
    (bookService.getBooks as jasmine.Spy).calls.reset();
    bookService.deleteBook = jasmine.createSpy('deleteBook').and.returnValue(throwError(() => new Error('Delete failed')));
    component.deleteBook(1);
    tick();
    expect(bookService.deleteBook).toHaveBeenCalledWith(1);
    expect(bookService.getBooks).not.toHaveBeenCalled();
  }));

  it('should toggle to card view', () => {
    component.toggleCardView();
    expect(component.isCardView).toBe(true);
    expect(viewStateService.setIsCardView).toHaveBeenCalledWith(true);
  });

  it('should toggle to table view', () => {
    component.toggleTableView();
    expect(component.isCardView).toBe(false);
    expect(viewStateService.setIsCardView).toHaveBeenCalledWith(false);
  });

  it('should change page and load books', fakeAsync(() => {
    component.onPageChange({ page: 1, rows: 20 });
    tick();
    expect(bookService.getBooks).toHaveBeenCalledWith(1, 20, '', 'title', 'ASC');
  }));

  it('should search books and reset to first page', fakeAsync(() => {
    component.searchQuery = 'test';
    component.searchBooks();
    tick();
    expect(bookService.getBooks).toHaveBeenCalledWith(0, 10, 'test', 'title', 'ASC');
    expect(component.currentPage).toBe(0);
  }));

  it('should sort books and reset to first page', fakeAsync(() => {
    component.selectedSortOption = { label: 'Price (Low to High)', sortBy: 'price', sortDirection: 'ASC' };
    component.onSortChange();
    tick();
    expect(bookService.getBooks).toHaveBeenCalledWith(0, 10, '', 'price', 'ASC');
    expect(component.currentPage).toBe(0);
  }));
});