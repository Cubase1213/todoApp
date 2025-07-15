import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoService } from '../../services/todo-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-todo-list',
	standalone: true,
	imports: [
		CommonModule,
		TodoItem,
		FormsModule,
		RouterLink,
		RouterLinkActive,
		ReactiveFormsModule
	],
	templateUrl: './todo-list.html',
	styleUrl: './todo-list.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoList {

	todoService = inject(TodoService);
	todos = this.todoService.todos;
	newTodoForm: FormGroup;

	constructor() {
		console.log('TodoList component initialized');
		this.newTodoForm = new FormGroup({
			title: new FormControl('', Validators.required)
		});
	}

	addTodo(): void {
		if (this.newTodoForm.valid) {
			const title = this.newTodoForm.get('title')?.value.trim();

			if (title && title.trim()) {
				this.todoService.addTodo(title.trim());
				this.newTodoForm.reset();
				console.log('New todo added via Reactive Forms:', title);
			}
		} else {
			console.warn('Form is invalid, cannot add todo');
			this.newTodoForm.markAsTouched(); // Megjelöli a formot, hogy a felhasználó lássa, hogy hibás
		}
	}
}
