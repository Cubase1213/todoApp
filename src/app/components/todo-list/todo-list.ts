import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoService } from '../../services/todo-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-todo-list',
	standalone: true,
	imports: [CommonModule, TodoItem, FormsModule, RouterLink, RouterLinkActive],
	templateUrl: './todo-list.html',
	styleUrl: './todo-list.scss'
})

export class TodoList {

	todoService = inject(TodoService);

	todos = this.todoService.todos;
	newTodoTitle: string = '';

	constructor() {
		console.log('TodoList component initialized');
	}

	toggleCompletted(id: number): void {
		console.log('Toggling completion for Todo ID (list):', id);
		this.todoService.toggleCompletted(id);
	}

	addTodo(): void {
		if (this.newTodoTitle.trim()) {
			this.todoService.addTodo(this.newTodoTitle);
			this.newTodoTitle = '';
		}
	}
}
