import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

class MockMessageService {
  add = jasmine.createSpy('add');
}

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MessageService, useClass: MockMessageService },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
    messageService = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HTTP 400 error', () => {
    const error = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
    service.handleError(error, 'Test Operation');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Test Operation failed: Bad request. Please check your input.',
      life: 5000,
    });
  });

  it('should handle HTTP 404 error', () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    service.handleError(error);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Operation failed: Resource not found.',
      life: 5000,
    });
  });

  it('should handle HTTP 500 error', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    service.handleError(error);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Operation failed: Server error. Please try again later.',
      life: 5000,
    });
  });

  it('should handle generic error', () => {
    const error = new Error('Something went wrong');
    service.handleError(error, 'Test');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Test failed: Something went wrong',
      life: 5000,
    });
  });
});