import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-book-form-component',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputText,
    InputNumberModule,
    CardModule,
    FileUploadModule
  ],
  templateUrl: './book-form-component.component.html',
  styleUrl: './book-form-component.component.scss'
})
export class BookFormComponentComponent {

  formBook!: FormGroup;
  isSaveinProgress: boolean = false;
  edit: boolean = false;
  selectedFile: File | null = null;

  /**
 * Constructor for the BookComponent.
 * Initializes the form group `formBook` with default values and validators.
 * @param {FormBuilder} fb - The Angular FormBuilder used to create the form group.
 * @param {BookService} bookService - Service responsible for interacting with the book data source.
 * @param {ActivatedRoute} activatedRoute - Provides access to information about a route associated with a component loaded in an outlet.
 * @param {MessageService} messageService - Service for displaying messages to the user.
 * @param {Router} router - Service for navigating between different views in the application.
 */
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formBook = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]], //Initialize to 1
      price: [0, [Validators.required, Validators.min(0)]], //Initialize to 0
      image: [null]
    })
  }

  /**
 * Initializes the component by checking the route parameter 'id'.
 * If 'id' is not 'new', sets the component to edit mode and fetches the book by ID.
 */
  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getBookById(+id!); //Cast to integer
    }
  }

  onFileSelected(event: FileSelectEvent) {
    this.selectedFile = event.files[0];
  }

  /**
 * Fetches a book by its ID and updates the form with the book's data.
 * If the book is not found, an error message is displayed, and the user is redirected to the home page.
 * @param {number} id - The unique identifier of the book to fetch.
 */
  getBookById(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (foundBook) => {
        // Updates the form with the fetched book's data.
        this.formBook.patchValue(foundBook);
      },
      error: () => {
        // Redirects the user to the home page.
        this.router.navigateByUrl('/');
      },
    });
  }

  /**
 * Handles the creation of a new book.
 * Validates the form, and if valid, sends a request to create the book.
 * Displays appropriate success or error messages based on the operation's outcome.
 */
  createBook() {
    if (this.formBook.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Check the fields and try again' });
      return;
    }
    if (!this.selectedFile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Choose an image and try again' });
      return;
    }
    this.isSaveinProgress = true;
    this.bookService.createBook(this.formBook.value, this.selectedFile).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Book saved correctly.' });
        this.isSaveinProgress = false;
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isSaveinProgress = false;
      },
    });
  }

  changeImage(event: FileSelectEvent) {
    this.selectedFile = event.files[0];
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose an image and try again'
      });
      return;
    }
    this.bookService.updateBookImage(this.formBook.value.id, this.selectedFile).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Book saved correctly.'
        });
        this.isSaveinProgress = false;
        this.router.navigateByUrl('/');
      }
    });
  }

  /**
   * Handles the update of an existent book.
   * Validates the form, and if valid, sends a request to update the book.
   * Displays appropriate success or error messages based on the operation's outcome.
   */
  updateBook() {
    if (this.formBook.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Check the fields and try again' }); // Fixed typo
      return;
    }
    this.isSaveinProgress = true;
    this.bookService.updateBook(this.formBook.value).subscribe({
      next: (updatedBook) => {
        if (this.selectedFile) {
          this.bookService.updateBookImage(this.formBook.value.id, this.selectedFile).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Book and image updated correctly.' });
              this.isSaveinProgress = false;
              this.router.navigateByUrl('/');
            },
            error: (err) => {
              this.isSaveinProgress = false;
            },
          });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Book updated correctly.' });
          this.isSaveinProgress = false;
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        this.isSaveinProgress = false;
      },
    });
  }

}
