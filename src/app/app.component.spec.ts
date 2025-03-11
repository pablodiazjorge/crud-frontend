import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([]), ToastModule],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'crud' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('crud');
  });

  // Update test to check for <p-toast> presence instead of title
  it('should render toast component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector('p-toast');
    expect(toast).toBeTruthy();
  });
});