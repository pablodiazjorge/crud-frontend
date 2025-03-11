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
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 0,
        totalPages: 1,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 0,
        empty: true,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete book and reload list on success', fakeAsync(() => {
    component.deleteBook(1);
    tick();
    expect(bookService.deleteBook).toHaveBeenCalledWith(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Book deleted' });
    expect(bookService.getBooks).toHaveBeenCalledWith(0, 10, '', 'title', 'ASC');
  }));

  it('should handle error when deleting book fails', fakeAsync(() => {
    (bookService.getBooks as jasmine.Spy).calls.reset(); // Reset calls from ngOnInit
    bookService.deleteBook = jasmine.createSpy('deleteBook').and.returnValue(throwError(() => new Error('Delete failed')));
    component.deleteBook(1);
    tick();
    expect(bookService.deleteBook).toHaveBeenCalledWith(1);
    expect(bookService.getBooks).not.toHaveBeenCalled();
  }));
});