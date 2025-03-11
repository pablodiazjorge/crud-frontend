import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { BookFormComponentComponent } from './book-form-component.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { BookService } from '../services/book.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

class MockBookService {
  createBook = jasmine.createSpy('createBook').and.returnValue({ subscribe: (o: any) => o.next() });
  updateBook = jasmine.createSpy('updateBook').and.returnValue({ subscribe: (o: any) => o.next({ id: 1 }) });
  updateBookImage = jasmine.createSpy('updateBookImage').and.returnValue({ subscribe: (o: any) => o.next() });
}

class MockMessageService {
  add = jasmine.createSpy('add');
}

class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('BookFormComponentComponent', () => {
  let component: BookFormComponentComponent;
  let fixture: ComponentFixture<BookFormComponentComponent>;
  let bookService: BookService;
  let messageService: MessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookFormComponentComponent,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        FileUploadModule,
      ],
      providers: [
        FormBuilder,
        { provide: BookService, useClass: MockBookService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('new') } } },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormComponentComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create book successfully and navigate to home', fakeAsync(() => {
    component.formBook.patchValue({ title: 'New Book', author: 'New Author', pages: 50, price: 9.99 });
    component.selectedFile = new File([''], 'test.jpg');
    component.createBook();
    tick();
    expect(bookService.createBook).toHaveBeenCalledWith(component.formBook.value, component.selectedFile);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Saved', detail: 'Book saved correctly.' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should handle error when creating book fails', fakeAsync(() => {
    bookService.createBook = jasmine.createSpy('createBook').and.returnValue(throwError(() => new Error('Server error')));
    component.formBook.patchValue({ title: 'New Book', author: 'New Author' });
    component.selectedFile = new File([''], 'test.jpg');
    component.createBook();
    tick();
    expect(bookService.createBook).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  }));

  it('should update book successfully without image and navigate to home', fakeAsync(() => {
    component.edit = true;
    component.formBook.patchValue({ id: 1, title: 'Updated Book', author: 'Updated Author', pages: 150, price: 29.99 });
    component.selectedFile = null;
    component.updateBook();
    tick();
    expect(bookService.updateBook).toHaveBeenCalledWith(component.formBook.value);
    expect(bookService.updateBookImage).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Saved', detail: 'Book updated correctly.' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should update book and image successfully and navigate to home', fakeAsync(() => {
    component.edit = true;
    component.formBook.patchValue({ id: 1, title: 'Updated Book', author: 'Updated Author' });
    component.selectedFile = new File([''], 'test.jpg');
    component.updateBook();
    tick();
    expect(bookService.updateBook).toHaveBeenCalledWith(component.formBook.value);
    expect(bookService.updateBookImage).toHaveBeenCalledWith(1, component.selectedFile);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Saved', detail: 'Book and image updated correctly.' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should handle error when updating book fails', fakeAsync(() => {
    component.edit = true;
    bookService.updateBook = jasmine.createSpy('updateBook').and.returnValue(throwError(() => new Error('Server error')));
    component.formBook.patchValue({ id: 1, title: 'Updated Book', author: 'Updated Author' });
    component.selectedFile = null;
    component.updateBook();
    tick();
    expect(bookService.updateBook).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  }));

  it('should show error when updating book with invalid form', () => {
    component.edit = true;
    component.formBook.patchValue({ title: '', author: '' });
    component.updateBook();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Check the fields and try again',
    });
    expect(bookService.updateBook).not.toHaveBeenCalled();
  });
});