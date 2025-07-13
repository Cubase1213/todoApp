import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected title = 'Teendőlista App';
}
