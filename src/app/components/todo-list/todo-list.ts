import { ChangeDetectionStrategy, Component, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoService } from '../../services/todo-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('listAnimation', [
			transition(':enter', [
				query('.todo-item-link', [
					style({ opacity: 0, transform: 'scale(0.8)' }),
					stagger(10, [
						animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
					])
				], { optional: true }),
			]),
			transition(':leave', [
				query('.todo-item-link', [
					style({ opacity: 1, transform: 'scale(1)' }),
					stagger(-10, [
						animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
					])
				], { optional: true }),
			])
		])
	]
})

export class TodoList {

	todoService = inject(TodoService);
	todos = this.todoService.todos;
	newTodoForm: FormGroup;
	isFormFocused = signal(false);

	// Signal a törlés alatt lévő teendő azonosítójának tárolására
	deletingTodoIds = signal(new Set<number>());

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

	handleDeleteTodo(todoId: number): void {
		console.log('Deleting todo with ID:', todoId);
		this.deletingTodoIds.update((ids) => {
			const newSet = new Set(ids);
			newSet.add(todoId);
			return newSet;
		});

		this.todoService.deleteTodo(todoId).subscribe({
			next: () => {
				console.log('Todo deleted successfully:', todoId);
			},
			error: (error) => {
				console.error('Error deleting todo:', error);
				this.deletingTodoIds.update(ids => {
					const newSet = new Set(ids);
					newSet.delete(todoId);
					return newSet;
				});
			},
			complete: () => {
				this.deletingTodoIds.update(ids => {
					const newSet = new Set(ids);
					newSet.delete(todoId);
					return newSet;
				});
				console.log('Todo deletion process completed for ID:', todoId);
			}
		})
			
	}
}
