import { Injectable, signal, computed } from '@angular/core';
import { TodoInterface } from '../interfaces/todo-interfaces';

@Injectable({
  providedIn: 'root'
})

export class TodoService {

	private _todos = signal<TodoInterface[]>([
		{ id: 1, title: 'Learn Angular', completed: false, createdAt: new Date('2025-07-13T10:30:00') },
		{ id: 2, title: 'Build a Todo App', completed: false, createdAt: new Date('2025-07-15T07:00:00') },
		{ id: 3, title: 'Deploy the App', completed: false, createdAt: new Date('2025-07-15T07:30:00') },
		{ id: 4, title: 'Write Tests', completed: false, createdAt: new Date('2025-07-15T08:00:00') }
	]);

	todos = computed(() => this._todos());

	constructor() {
		console.log('TodoService initialized with todos:', this.todos());
	}

	addTodo(title: string): void {
		const newTodo: TodoInterface = {
			id: this._todos().length > 0 ? Math.max(...this._todos().map(t => t.id)) + 1 : 1,
			title: title.trim(),
			completed: false,
			createdAt: new Date()
		};
		this._todos.update(currentTodos => [...currentTodos, newTodo]);
		console.log('Added Todo:', newTodo);
	}

	toggleCompletted(id: number): void {
		console.log('Toggling completion for Todo ID:', id);
		this._todos.update(currentTodos => 
			currentTodos.map(todo => 
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		);
		console.log('Updated Todos:', this.todos());
	}

	updateTodo(id: number, title: string): void {
		this._todos.update(currentTodos => 
			currentTodos.map(todo => 
				todo.id === id ? { ...todo, title: title.trim() } : todo
			)
		);
		console.log('Updated Todos:', this.todos());
	}

	deleteTodo(id: number): void {
		this._todos.update(currentTodos => 
			currentTodos.filter(todo => todo.id !== id)
		);
		console.log('Deleted Todo ID:', id);
		console.log('All Todos after delete:', this.todos());
	}

	getTodoById(id: number) {
		return computed(() => this._todos().find(todo => todo.id === id));
	}

}
