import { Component, OnInit, OnDestroy, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TodoService } from '../../services/todo-service';

@Component({
	selector: 'app-todo-detail',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './todo-detail.html',
	styleUrl: './todo-detail.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoDetail implements OnInit, OnDestroy {

	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private todoService = inject(TodoService);

	todoId = toSignal(this.route.paramMap.pipe(
		switchMap(params => {
			const idParam = params.get('id');
			return of(idParam ? +idParam : null); // Convert string to number or null
		})
	));

	selectedTodo = computed(() => {
		const currentId = this.todoId();
		if (typeof currentId === 'number') {
			const currentTodo= this.todoService.getTodoById(currentId)();
			console.log('Selected Todo in detail:', currentTodo);
			return this.todoService.getTodoById(currentId)();
		}
		return undefined;
	});

	isEditMode = signal(false);
	editedTodo: string = '';

	constructor() {}

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	startEdit(): void {
		const todo = this.selectedTodo();
		if (todo) {
			this.editedTodo = todo.title;
			this.isEditMode.set(true);
		}
	}

	saveEdit(): void {
		const todo = this.selectedTodo();
		if (todo && this.editedTodo.trim()) {
			this.todoService.updateTodo(todo.id, this.editedTodo.trim());
			this.isEditMode.set(false);
			// this.editedTodo = '';
		}
	}

	cancelEdit(): void {
		this.isEditMode.set(false);
		// this.editedTodo = '';
	}

	goBack(): void {
		this.router.navigate(['/todos']);
	}
}
