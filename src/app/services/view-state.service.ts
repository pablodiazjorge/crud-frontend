import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ViewStateService {
    private readonly STORAGE_KEY = 'isCardView';
    private isCardView: boolean = true; // Default value

    constructor() {
        // Load state from localStorage on service initialization
        const savedView = localStorage.getItem(this.STORAGE_KEY);
        this.isCardView = savedView === 'false' ? false : true;
    }

    getIsCardView(): boolean {
        return this.isCardView;
    }

    setIsCardView(value: boolean): void {
        this.isCardView = value;
        localStorage.setItem(this.STORAGE_KEY, String(value));
    }
}