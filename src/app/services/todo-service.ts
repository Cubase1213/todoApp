import { Injectable, signal, computed } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class TodoService {

	private _todos = signal<TodoInterface[]>([
		{ id: 1, title: 'Learn Angular', completed: false },
		{ id: 2, title: 'Build a Todo App', completed: false },
		{ id: 3, title: 'Deploy the App', completed: false }
	]);

	todos = computed(() => this._todos());

	constructor() {
		console.log('TodoService initialized with todos:', this.todos());
	}

	addTodo(title: string): void {
		const newTodo: TodoInterface = {
			id: this._todos().length > 0 ? Math.max(...this._todos().map(t => t.id)) + 1 : 1,
			title: title.trim(),
			completed: false
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

	getTodoById(id: number) {
		return computed(() => this._todos().find(todo => todo.id === id));
	}

}
