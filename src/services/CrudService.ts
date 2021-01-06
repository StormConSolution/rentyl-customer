import { StandardOrderTypes, FilterQuery, PageQuery } from '../@types/redsky';
import http from '../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { AxiosResponse } from 'axios';

class CrudService<T> {
	tableName: string;
	constructor(tableName: string) {
		this.tableName = tableName;
	}

	create(obj: T): Promise<AxiosResponse<RsResponseData<T>>> {
		return http.post<RsResponseData<T>>(this.tableName, obj);
	}

	get(id: number): Promise<AxiosResponse<RsResponseData<T>>> {
		return http.get<RsResponseData<T>>(this.tableName, { id });
	}

	getMultiple(ids: number[]): Promise<AxiosResponse<RsResponseData<T>[]>> {
		return http.get<RsResponseData<T>[]>(this.tableName, { ids });
	}

	getPaginatedList(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: StandardOrderTypes,
		filter?: FilterQuery
	) {
		if (page === 0) {
			throw new Error('Page numbering is 1 based. Must be 1 or greater.');
		} else if (perPage <= 0) {
			throw new Error('Per Page must be positive integer greater than zero.');
		}

		let query: PageQuery = {
			pagination: { page, perPage }
		};
		if (sortField && sortOrder) {
			query.sort = { field: sortField, order: sortOrder };
		}
		if (filter) {
			query.filter = filter;
		}

		// request.get requires simple key:value pairs, so no nested objects.
		// @ts-ignore
		query.pagination = JSON.stringify(query.pagination);
		// @ts-ignore
		if (query.sort) query.sort = JSON.stringify(query.sort);
		// @ts-ignore
		if (query.filter) query.filter = JSON.stringify(query.filter);
		return http.get(this.tableName + '/paged', query);
	}

	getByReference(
		target: string,
		id: number,
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: string,
		filter: any
	) {
		throw new Error('Not implemented yet.');
		//return this.requests.get(this.tableName + '/paged', { tablePagination: { page , perPage }, sort: { field: sortFiled, order: sortOrder }, filter })
	}

	update(obj: any) {
		return http.put(this.tableName, obj);
	}

	delete = (id: number) => {
		return http.delete(this.tableName, { id });
	};
}

export default CrudService;
