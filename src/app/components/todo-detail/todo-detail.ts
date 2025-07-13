import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-todo-detail',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './todo-detail.html',
	styleUrl: './todo-detail.scss'
})

export class TodoDetail implements OnInit {
	todoId: number | null = null;
	private routeSubscription: Subscription | undefined;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.routeSubscription = this.route.paramMap.subscribe(params => {
			const idParam = params.get('id');
			if (idParam) {
				this.todoId = +idParam; // Convert string to number
				console.log(`Todo ID: ${this.todoId}`);
			} else {
				this.todoId = null;
				console.warn('No ID provided in route parameters.');
			}
		});
	}
}
