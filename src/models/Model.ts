import http from '../utils/http';
import {
	FilterQuery,
	PageQuery,
	RsPagedResponseData,
	RsUpdateMultiple,
	RsUpdateSingle,
	StandardOrderTypes
} from '../@types/redsky';

export class Model {
	protected modelName = '';
	start() {}
	refreshData(): Promise<void> {
		return new Promise<void>((resolve) => {
			resolve();
		});
	}

	create<T>(obj: T) {
		return http.post<T>(this.modelName, obj);
	}

	get<T>(id: number) {
		return http.get<T>(this.modelName, { id });
	}

	getMultiple<T>(ids: number[]) {
		return http.get<T[]>(this.modelName, { ids });
	}

	getPaginatedList<T>(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: StandardOrderTypes,
		filter?: FilterQuery | null,
		alternatePath?: string
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

		let path = alternatePath ? alternatePath : this.modelName + '/paged';
		return http.get<RsPagedResponseData<T>>(path, this.convertDataForUrlParams(query));
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
		//return https.get(this.modelName + '/paged', { tablePagination: { page , perPage }, sort: { field: sortFiled, order: sortOrder }, filter })
	}

	update<T extends RsUpdateSingle | RsUpdateMultiple>(obj: T) {
		return http.put(this.modelName, obj);
	}

	delete(id: number) {
		return http.delete(this.modelName, { id });
	}

	private convertDataForUrlParams(data: any): any {
		let convertedData: any = {};
		for (let i in data) {
			if (typeof data[i] === 'object') {
				convertedData[i] = JSON.stringify(data[i]);
			} else {
				convertedData[i] = data[i];
			}
		}
		return convertedData;
	}
}
