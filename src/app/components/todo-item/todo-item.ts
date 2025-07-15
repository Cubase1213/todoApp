import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInterface } from '../../interfaces/todo-interfaces';

@Component({
	selector: 'app-todo-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './todo-item.html',
	styleUrl: './todo-item.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItem {

	@Input({ required: true }) todo!: TodoInterface;

	@Output() completedChange = new EventEmitter<number>();
	@Output() deleteTodo = new EventEmitter<number>();

	constructor() {
		// A konstruktorban nem biztos, hogy az input már elérhető,
	}

	onToggleCompleted(event: Event): void {
		event.stopPropagation(); // Megakadályozza, hogy a click esemény tovább terjedjen
		this.completedChange.emit(this.todo.id);
	}

	onDelete(event: Event): void {
		event.stopPropagation(); // Megakadályozza, hogy a click esemény tovább terjedjen
		this.deleteTodo.emit(this.todo.id);
	}

}
