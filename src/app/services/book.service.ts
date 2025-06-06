import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from './supabase.service';
import { Book, BookWithImageDTO } from '../models/book';
import { Page } from '../models/page';
import { ErrorHandlerService } from './error-handler.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly BUCKET_NAME = 'book-images';

  constructor(
    private supabaseService: SupabaseService,
    private errorHandler: ErrorHandlerService
  ) {}

  getBooks(
    page: number = 0,
    pageSize: number = 10,
    searchQuery: string = '',
    sortBy: string = 'title',
    sortDirection: string = 'ASC'
  ): Observable<Page<BookWithImageDTO>> {
    const fromIndex = page * pageSize;
    const toIndex = fromIndex + pageSize - 1;

    const query = this.supabaseService.supabase
      .from('books')
      .select('*', { count: 'exact' })
      .ilike('title', `%${searchQuery}%`)
      .order(sortBy, { ascending: sortDirection === 'ASC' })
      .range(fromIndex, toIndex);

    return from(
      query.then((response: PostgrestSingleResponse<any[]>) => {
        if (response.error) throw response.error;

        const { data, count } = response;
        if (!data) throw new Error('No data received');

        return {
          content: data.map(
            (book: {
              id: number;
              title: string;
              author: string;
              pages: number;
              price: number;
              image_id: number | null;
              name: string | null;
              image_url: string | null;
              image_image_id: string | null;
            }) => ({
              id: book.id,
              title: book.title,
              author: book.author,
              pages: book.pages,
              price: book.price,
              imageId: book.image_id,
              imageName: book.name,
              imageUrl: book.image_url,
              imageImageId: book.image_image_id,
            })
          ),
          totalElements: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          pageable: {
            pageNumber: page,
            pageSize,
            sort: {
              empty: !sortBy,
              sorted: !!sortBy,
              unsorted: !sortBy,
            },
            offset: fromIndex,
            paged: true,
            unpaged: false,
          },
          last: page === Math.ceil((count || 0) / pageSize) - 1,
          size: pageSize,
          number: page,
          first: page === 0,
          numberOfElements: data.length,
          empty: data.length === 0,
        };
      })
    ).pipe(
      catchError((err: Error) => {
        this.errorHandler.handleError(err, 'Failed to fetch books');
        return throwError(() => err);
      })
    );
  }

  // Obtener libro por ID
  getBookById(id: number): Observable<BookWithImageDTO> {
    return from(
      this.supabaseService.supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          pages: data.pages,
          price: data.price,
          imageId: data.image_id,
          imageName: data.name,
          imageUrl: data.image_url,
          imageImageId: data.image_image_id,
        };
      }),
      catchError((err: Error) => {
        this.errorHandler.handleError(err, 'Book not found');
        return throwError(() => err);
      })
    );
  }

  // Crear libro con imagen
  createBook(book: Book, image: File): Observable<BookWithImageDTO> {
    const imagePath = `${uuidv4()}-${image.name}`;

    return from(
      this.supabaseService.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(imagePath, image)
    ).pipe(
      switchMap(({ error: uploadError }) => {
        if (uploadError) throw uploadError;

        const publicUrl = this.supabaseService.supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(imagePath).data.publicUrl;

        const newBook = {
          title: book.title,
          author: book.author,
          pages: book.pages,
          price: book.price,
          image_id: book.id || null,
          name: book.title, // Usamos el título como nombre de imagen (ajustable)
          image_url: publicUrl,
          image_image_id: imagePath,
        };

        return from(
          this.supabaseService.supabase
            .from('books')
            .insert(newBook)
            .select()
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return {
              id: data.id,
              title: data.title,
              author: data.author,
              pages: data.pages,
              price: data.price,
              imageId: data.image_id,
              imageName: data.name,
              imageUrl: data.image_url,
              imageImageId: data.image_image_id,
            };
          })
        );
      }),
      catchError((err: Error) => {
        this.errorHandler.handleError(err, 'Check the fields and try again.');
        return throwError(() => err);
      })
    );
  }

  // Actualizar libro sin cambiar la imagen
  updateBook(book: Book): Observable<BookWithImageDTO> {
    const { id, ...updateData } = book;

    return from(
      this.supabaseService.supabase
        .from('books')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          pages: data.pages,
          price: data.price,
          imageId: data.image_id,
          imageName: data.name,
          imageUrl: data.image_url,
          imageImageId: data.image_image_id,
        };
      }),
      catchError((err: Error) => {
        this.errorHandler.handleError(
          err,
          'Check the selected file and try again.'
        );
        return throwError(() => err);
      })
    );
  }

  // Eliminar libro
  deleteBook(id: number): Observable<void> {
    return from(
      this.supabaseService.supabase.from('books').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError((err: Error) => {
        this.errorHandler.handleError(err, 'Could not delete book.');
        return throwError(() => err);
      })
    );
  }

  // Actualizar imagen de un libro
  updateBookImage(id: number, image: File): Observable<BookWithImageDTO> {
    const imagePath = `${uuidv4()}-${image.name}`;

    return from(
      this.supabaseService.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(imagePath, image)
    ).pipe(
      switchMap(({ error: uploadError }) => {
        if (uploadError) throw uploadError;

        const publicUrl = this.supabaseService.supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(imagePath).data.publicUrl;

        return from(
          this.supabaseService.supabase
            .from('books')
            .update({
              image_url: publicUrl,
              image_image_id: imagePath,
              name: image.name,
            })
            .eq('id', id)
            .select()
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return {
              id: data.id,
              title: data.title,
              author: data.author,
              pages: data.pages,
              price: data.price,
              imageId: data.image_id,
              imageName: data.name,
              imageUrl: data.image_url,
              imageImageId: data.image_image_id,
            };
          })
        );
      }),
      catchError((err: Error) => {
        this.errorHandler.handleError(
          err,
          'Check the selected file and try again.'
        );
        return throwError(() => err);
      })
    );
  }
}
