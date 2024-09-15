import { faker } from '@faker-js/faker';

export interface User {
	id: string;
	name: string;
	email: string;
	age: number;
}

export function generateUser(overrides: Partial<User> = {}): User {
	return {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		age: faker.number.int({ min: 18, max: 80 }),
		...overrides,
	};
}

export function generateUsers(count: number): User[] {
	return Array.from({ length: count }, () => generateUser());
}
