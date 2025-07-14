import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TodoService } from '../../services/todo-service';

@Component({
	selector: 'app-todo-detail',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './todo-detail.html',
	styleUrl: './todo-detail.scss'
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

	constructor() {}

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	goBack(): void {
		this.router.navigate(['/todos']);
	}
}
