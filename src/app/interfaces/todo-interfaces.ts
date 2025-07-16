export interface TodoInterface {
	id: number;
	title: string;
	completed: boolean;
	createdAt: Date;
}

export interface TodoApiResponse {
	todos: {
		id: number;
		todo: string;
		completed: boolean;
		userId: number;
	}[];
	total: number;
	skip: number;
	limit: number;
}

