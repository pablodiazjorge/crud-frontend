import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor(private messageService: MessageService) { }

    handleError(error: HttpErrorResponse | Error, context: string = 'Operation'): void {
        let errorMessage: string;

        if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors
            switch (error.status) {
                case 400:
                    errorMessage = `${context} failed: Bad request. Please check your input.`;
                    break;
                case 404:
                    errorMessage = `${context} failed: Resource not found.`;
                    break;
                case 500:
                    errorMessage = `${context} failed: Server error. Please try again later.`;
                    break;
                default:
                    errorMessage = `${context} failed: ${error.message || 'An unexpected error occurred.'}`;
            }
        } else {
            // Handle client-side errors
            errorMessage = `${context} failed: ${error.message || 'An unexpected error occurred.'}`;
        }

        // Display the error message using MessageService
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000 // Display for 5 seconds
        });

        // Log the error for debugging
        console.error(`${context} Error:`, error);
    }
}