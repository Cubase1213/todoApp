import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap, map } from 'rxjs';
import { TodoInterface, TodoApiResponse } from '../interfaces/todo-interfaces';

@Injectable({
  providedIn: 'root'
})

export class TodoService {

	private http = inject(HttpClient);

	private baseUrl = 'https://dummyjson.com';

	private _todos = signal<TodoInterface[]>([]);

	todos = computed(() => this._todos());

	constructor() {
		this.loadTodos();
		console.log('TodoService initialized with todos:', this.todos());
	}

	fetchTodosFromApi(): Observable<TodoInterface[]> {
		return this.http.get<TodoApiResponse>(`${this.baseUrl}/todos`)
			.pipe(
				// Egy kis késleltetés, hogy jobban érzékelhető legyen a hálózati hívás
				// delay(1000),
				tap((response) => console.log('Fetched Todos from API:', response)),
				map(response => response.todos.map(apiTodo => ({
					id: apiTodo.id,
					title: apiTodo.todo,
					completed: apiTodo.completed,
					createdAt: new Date(),
					userId: apiTodo.userId
				}))),
			);
	}

	loadTodos(): void {
		this._todos.set([]); // Reset the todos before loading
		this.fetchTodosFromApi().subscribe({
			next: (todos) => {
				this._todos.set(todos);
				console.log('Teendők betöltve:', this.todos());
			},
			error: (error) => console.error('Hiba a teendők betöltésekor:', error)
		});
	}

	addTodo(title: string): void {
		const newTodo = {
			todo: title.trim(),
			completed: false,
			userId: 1
		};

		this.http.post<any>(`${this.baseUrl}/todos/add`, newTodo)
			.pipe(
				// delay(1000), // Késleltetés a szimulációhoz
				tap((response) => console.log('API válasz új teendő hozzáadásakor:', response)),
				map(apiResponse => ({
					id: apiResponse.id,
					title: apiResponse.todo,
					completed: apiResponse.completed,
					createdAt: new Date(),
					userId: apiResponse.userId
				}))
			)
			.subscribe({
				next: (addedTodo) => {
					this._todos.update(currentTodos => [...currentTodos, addedTodo]);
					console.log('Új teendő hozzáadva:', addedTodo);
				},
				error: (error) => console.error('Hiba új teendő hozzáadásakor:', error)
			});
	}

	/**
	 * A teendő befejezettségi állapotának módosítása
	 * Előtte elküljük az API-nak a módosítást
	 * @param id Az azonosítója a teendőnek, amelyet módosítani szeretnénk
	 */
	toggleCompleted(id: number): void {
		const todoToUpdate = this._todos().find(todo => todo.id === id);
		if (!todoToUpdate) return;

		const newCompletedStatus = !todoToUpdate.completed;

		this.http.put<any>(`${this.baseUrl}/todos/${id}`, { completed: newCompletedStatus })
			.pipe(
				// delay(1000), // Késleltetés a szimulációhoz
				tap((response) => console.log('API válasz teendő befejezettségi állapotának módosításakor:', response)),
				map(apiResponse => ({
					id: apiResponse.id,
					title: apiResponse.todo,
					completed: apiResponse.completed,
					createdAt: todoToUpdate.createdAt,
					userId: apiResponse.userId
				}))
			)
			.subscribe({
				next: (receivedTodo) => {
					this._todos.update(currentTodos => 
						currentTodos.map(todo => 
							todo.id === id ? { ...todo, completed: receivedTodo.completed } : todo
						)
					);
					console.log('Teendő befejezettségi állapota módosítva:', receivedTodo);
				},
				error: (error) => console.error('Hiba a teendő befejezettségi állapotának módosításakor:', error)
			});
	}

	updateTodo(id: number, newTitle: string): void {
		const todoToUpdate = this._todos().find(todo => todo.id === id);
		if (!todoToUpdate) return;

		this.http.put<any>(`${this.baseUrl}/todos/${id}`, { todo: newTitle.trim() })
			.pipe(
				// delay(1000), // Késleltetés a szimulációhoz
				tap((response) => console.log('API válasz teendő frissítésekor:', response)),
				map(apiResponse => ({
					id: apiResponse.id,
					title: apiResponse.todo,
					completed: todoToUpdate.completed,
					createdAt: todoToUpdate.createdAt,
					userId: apiResponse.userId
				}))
			)
			.subscribe({
				next: (receivedTodo) => {
					this._todos.update(currentTodos => 
						currentTodos.map(todo => 
							todo.id === id ? { ...todo, title: receivedTodo.title } : todo
						)
					);
					console.log('Teendő frissítve:', receivedTodo);
				},
				error: (error) => console.error('Hiba a teendő frissítésekor:', error)
			});
	}

	deleteTodo(id: number): Observable<void> {
		return this.http.delete<any>(`${this.baseUrl}/todos/${id}`)
			.pipe(
				delay(1000), // Késleltetés a szimulációhoz
				tap((response) => console.log('API válasz teendő törlésekor:', response)),
				map(apiResponse => {
					if (apiResponse.isDeleted) {
						this._todos.update(currentTodos => 
							currentTodos.filter(todo => todo.id !== id)
						);
						return;
					} else {
						throw new Error('Teendő törlése sikertelen');
					}
				})
			)
	}

	getTodoById(id: number) {
		return computed(() => this._todos().find(todo => todo.id === id));
	}

}
