import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoService } from '../../services/todo-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-todo-list',
	standalone: true,
	imports: [
		CommonModule,
		TodoItem,
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
	isFormFocused = signal(false);

	constructor() {
		console.log('TodoList component initialized');
		this.newTodoForm = new FormGroup({
			title: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50),
				this.forbiddenWordsValidator('test')
			])
		});
	}

	forbiddenWordsValidator(forbiddenWord: string): (control: AbstractControl) => ValidationErrors | null {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value as string;
			if (value && value.toLowerCase().includes(forbiddenWord.toLowerCase())) {
				return { forbiddenWord: { value: control.value, forbidden: forbiddenWord } };
			}
			return null;
		};
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
