import { Component, effect, model } from '@angular/core';

@Component({
	selector: 'app-counter',
	standalone: true,
	imports: [],
	templateUrl: './counter.html',
	styleUrl: './counter.scss'
})

export class CounterComponent {

	count = model(0);

	constructor() {
		effect(() => {
			console.log('Count changed:', this.count());
		});
	}

	increment(): void {
		this.count.update(value => value + 1);
	}

	decrement(): void {
		this.count.update(value => value - 1);  
	}

}
