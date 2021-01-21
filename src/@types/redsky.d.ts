type StandardOrderTypes = 'ASC' | 'DESC' | 'RAND' | 'NONE';
type ConjunctionTypes = 'AND' | 'OR';
type MatchTypes = 'exact' | 'fuzzy' | 'like' | 'greaterThan' | 'greaterThanEqual' | 'lessThan' | 'lessThanEqual';

export interface RsResponseData<T> {
	data: T | any;
}

export interface RsErrorData {
	err: string;
	msg: string;
	stack?: string;
}

// Standard Api Update
export interface RsCreateSingle {
	data: any;
}

export interface RsUpdateSingle {
	id: number;
	data: any;
}

export interface RsUpdateMultiple {
	ids: number[];
	data: any;
}

export interface RsDeleteSingle {
	id: number;
}

export interface RsDeleteMultiple {
	ids: number;
}

export interface RsPagedResponseData<T> extends RsResponseData<T> {
	total?: number;
}

export interface GenericCreateObjectFromRequest {
	body: any;
	user?: Api.User.Model;
}

export interface SortQuery {
	field: string;
	order: StandardOrderTypes;
}

export interface FilterQuery {
	matchType: MatchTypes;
	searchTerm: FilterQueryValue[];
}

export interface FilterQueryValue {
	column: string;
	value: string | string[] | number | number[];
	conjunction?: ConjunctionTypes;
	matchType?: MatchTypes;
}

export interface PagePagination {
	page: number;
	perPage: number;
}

export interface PageQuery {
	pagination: PagePagination;
	sort?: SortQuery;
	filter?: FilterQuery;
}

export interface IntegrationCompanyDetails extends Model.Company {
	serviceType: string;
	serviceName: any;
	serviceKey: any;
}
