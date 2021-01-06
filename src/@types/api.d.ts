declare namespace Api {
	export namespace User {
		export namespace Req {
			export interface Login {
				username: string;
				password: string;
			}

			export interface Create {
				name: string;
				primaryEmail: string;
				password: string;
				role: string;
				title?: string;
				phone?: string;
			}

			export interface UsersEmail {
				id: number | number[];
			}

			export interface Update {
				id?: number;
				primaryEmail?: string;
				name?: string;
				password?: string;
				token?: string;
				role?: Model.UserRoleType;
				phone?: string;
				profilePictureUrl?: string;
				permissionLogin?: boolean;
				emailVerified?: boolean | string;
				billingAddress1?: string;
				billingAddress2?: string;
				billingCity?: string;
				billingState?: string;
				billingZip?: string;
				billingCountry?: string;
			}
		}

		export namespace Res {
			export interface Login extends Model.User {}
			export interface Create extends Model.User {}
			export interface Update {
				id?: number;
				primaryEmail?: string;
				name?: string;
				password?: string;
				token?: string;
				role?: Model.UserRoleType;
				phone?: string;
				profilePictureUrl?: string;
				permissionLogin?: boolean;
				emailVerified?: boolean | string;
				billingAddress1?: string;
				billingAddress2?: string;
				billingCity?: string;
				billingState?: string;
				billingZip?: string;
				billingCountry?: string;
			}

			export interface UsersEmail {
				primaryEmails: string | string[];
			}
		}
	}
}
