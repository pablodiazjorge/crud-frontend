import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { BookFormComponentComponent } from './book-form-component/book-form-component.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponentComponent,
        title:'Book Management'
    },
    {
        path: 'book-form-component/:id',
        component: BookFormComponentComponent,
        title:'Books formulary'
    },
    {
        path: '**',
        redirectTo:'',
        pathMatch:'full'
    },
];
