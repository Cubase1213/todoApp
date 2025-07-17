import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInterface } from '../../interfaces/todo-interfaces';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'app-todo-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './todo-item.html',
	styleUrl: './todo-item.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('deleteAnimation', [
			// 'normal' állapot, amikor a teendő látható
			state('normal', style({
				opacity: 1,
				transform: 'scale(1)',
				height: '*'
			})),
			state('deleting', style({
				opacity: 0.3,
				transform: 'scale(0.95)',
				height: '*'
			})),
			state('removed', style({
				opacity: 0,
				transform: 'scale(0)',
				height: '0px',
				paddingTop: '0px',
				paddingBottom: '0px',
				marginTop: '0px',
				borderWidth: '0px'
			})),
			transition('normal <=> deleting', [
				animate('200ms ease-in-out')
			]),
			transition('deleting => removed', [
				animate('300ms ease-in-out')
			])
		])
	],
})
export class TodoItem {

	@Input({ required: true }) todo!: TodoInterface;
	@Input() isDeleting: boolean = false;

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

	get animationState(): string {
		return this.isDeleting ? 'deleting' : 'normal';
	}

}
