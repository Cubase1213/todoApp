import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../todo-item/todo-item';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';

@Component({
	selector: 'app-todo-list',
	standalone: true,
	imports: [CommonModule, TodoItem, FormsModule],
	templateUrl: './todo-list.html',
	styleUrl: './todo-list.scss'
})

export class TodoList {

	private todoService = inject(TodoService);

	todos = this.todoService.todos;
	newTodoTitle: string = '';

	constructor() {
		console.log('TodoList component initialized');
	}

	handleCompletedChange(id: number): void {
		this.todoService.toggleCompletted(id);
	}

	addTodo(): void {
		if (this.newTodoTitle.trim()) {
			this.todoService.addTodo(this.newTodoTitle);
			this.newTodoTitle = '';
		}
	}
}
