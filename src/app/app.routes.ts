import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoDetail } from './components/todo-detail/todo-detail';

export const routes: Routes = [
    { path: 'todos', component: TodoList },
    { path: 'todo/:id', component: TodoDetail },
    { path: '', redirectTo: '/todos', pathMatch: 'full' },
    { path: '**', redirectTo: '/todos' },
];
