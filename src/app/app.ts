import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './components/counter/counter';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		CounterComponent,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected title = 'Teendőlista App';

	// Példa a kétirányú adatkötésre
	parentCount = signal(10);
}
