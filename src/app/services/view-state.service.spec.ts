import { TestBed } from '@angular/core/testing';
import { ViewStateService } from './view-state.service';

describe('ViewStateService', () => {
    let service: ViewStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ViewStateService],
        });
        service = TestBed.inject(ViewStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get card view state', () => {
        service.setIsCardView(false);
        expect(service.getIsCardView()).toBe(false);
        service.setIsCardView(true);
        expect(service.getIsCardView()).toBe(true);
    });
});