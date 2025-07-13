import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
	selector: 'app-todo-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './todo-item.html',
	styleUrl: './todo-item.scss'
})
export class TodoItem {

	@Input({ required: true }) todo!: TodoInterface;

	@Output() completedChange = new EventEmitter<number>();

	constructor() {
		// A konstruktorban nem biztos, hogy az input már elérhető,
	}

	onToggleCompleted(): void {
		this.completedChange.emit(this.todo.id);
	}
}
