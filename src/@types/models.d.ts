declare namespace Model {
	export type UserRoleType = 'support' | 'anonymous' | 'self' | 'user' | 'admin' | 'super_admin';

	export interface User {
		id: number;
		primaryEmail: string;
		name: string;
		password: string;
		token: string;
		role: UserRoleType;
	}
}
