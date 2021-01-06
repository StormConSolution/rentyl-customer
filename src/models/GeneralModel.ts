import cloneDeep from 'lodash.clonedeep';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import CrudService from '../services/CrudService';

interface InterfaceBase {
	id?: number;
}

interface ObjectStorage<T> {
	[key: number]: T;
}

export default class GeneralModel<T extends InterfaceBase> {
	private crudEndpoints: CrudService<T>;
	private downloadAllEndpoint: any;
	private jsonFields: any;
	private Objects: ObjectStorage<T> = {};
	private ChangeHandlers: any = {};
	private SingleChangeHandlers: any = {};
	private CurrentChangeHandlers: any = {};
	private CurrentObjId: number = 0;
	private LastSubscribeId: number = Date.now();

	constructor(crudEndpoints: CrudService<T>, downloadAllEndpoint?: any, jsonFields?: any) {
		this.crudEndpoints = crudEndpoints;
		this.downloadAllEndpoint = downloadAllEndpoint;
		this.jsonFields = jsonFields;
		this.getData = this.getData.bind(this);
	}

	onChange = (callback: any): number => {
		let id: number = this.LastSubscribeId++;
		this.ChangeHandlers[id] = callback;
		return id;
	};

	onCurrentChange = (callback: any): number => {
		let id: number = this.LastSubscribeId++;
		this.CurrentChangeHandlers[id] = callback;
		return id;
	};

	onSingleChange = (id: number, callback: any): number => {
		let subscribeId: number = this.LastSubscribeId++;
		if (!this.SingleChangeHandlers[id]) this.SingleChangeHandlers[id] = {};
		this.SingleChangeHandlers[id][subscribeId] = callback;
		return subscribeId;
	};

	unsubscribe = (id: any): void => {
		if (this.ChangeHandlers[id]) {
			delete this.ChangeHandlers[id];
		} else if (this.CurrentChangeHandlers[id]) {
			delete this.CurrentChangeHandlers[id];
		} else {
			for (let i in this.SingleChangeHandlers) {
				for (let j in this.SingleChangeHandlers[i]) {
					if (j === id) {
						delete this.SingleChangeHandlers[i][j];
					}
				}
			}
		}
	};

	save = async (obj: any, localOnly = false) => {
		if (localOnly) {
			let existing: any = this.Objects[obj.id] || {};
			for (let i in obj) {
				existing[i] = obj[i];
			}
			this.Objects[obj.id] = existing;
			this.fireChanged(obj.id);
			return cloneDeep(existing);
		} else if (!obj.id) {
			let axiosResponse = await this.crudEndpoints.create(obj);
			let createdObj: T = axiosResponse.data.data;
			if (!createdObj.id) return;
			this.Objects[createdObj.id] = this.convertJsonFields(createdObj, this.jsonFields);
			this.fireChanged(createdObj.id);
			return cloneDeep(createdObj);
		} else {
			let res = await this.crudEndpoints.update(obj);
			if (!res || !res.data) return res;
			this.Objects[obj.id] = this.convertJsonFields(res.data, this.jsonFields);
			this.fireChanged(obj.id);
			return cloneDeep(res);
		}
	};

	delete = async (id: number, localOnly = false) => {
		//make async
		delete this.Objects[id];
		this.fireChanged(id);
		if (localOnly) return;
		await this.crudEndpoints.delete(id);
	};

	obj = (id: number) => {
		return cloneDeep(this.Objects[id]);
	};

	objs = () => {
		return cloneDeep(this.Objects);
	};

	getCurrent = () => {
		return this.Objects[this.CurrentObjId] || {};
	};

	clearCurrent = () => {
		this.CurrentObjId = 0;
	};

	setCurrentAndUpdate = (obj: any) => {
		if (!obj) return;
		this.CurrentObjId = obj.id;
		this.Objects[obj.id] = obj;
		this.fireChanged(obj.id);
	};

	setCurrentWithId = (id: number) => {
		this.CurrentObjId = id;
	};

	refreshData = async (optionalId?: number) => {
		if (optionalId) await this.getDataOne(optionalId);
		else await this.getData();
	};

	private convertJsonFields(data: any, jsonFields: string[]): T {
		for (let fieldName in jsonFields) {
			if (data.hasOwnProperty(fieldName) === false) continue;
			try {
				let convertedObject = JSON.parse(data[fieldName]);
				data[fieldName] = convertedObject;
			} catch (e) {
				data[fieldName] = {};
			}
		}
		return data;
	}

	private getDataOne = async (id: number) => {
		// @ts-ignore
		let axiosResponse = await this.crudEndpoints.get(id);
		let obj = axiosResponse.data.data;
		if (obj && obj.id) {
			this.Objects[obj.id] = obj;
			this.fireChanged(id);
		}
	};

	private getData = async () => {
		//if (!models || !this.downloadAllEndpoint) return;

		let objects = (await this.downloadAllEndpoint()).data;
		if (!objects) {
			this.fireChanged();
			return;
		}

		// Convert to an array if we got just a single object
		if (!Array.isArray(objects)) {
			this.CurrentObjId = objects.id;
			objects = [objects];
		}
		this.Objects = ObjectUtils.toObject(objects, 'id');
		this.fireChanged();
	};

	private fireChanged = (optionalId?: number) => {
		for (let i in this.ChangeHandlers) {
			this.ChangeHandlers[i](cloneDeep(this.Objects));
		}
		if (optionalId) {
			for (let i in this.SingleChangeHandlers[optionalId]) {
				this.SingleChangeHandlers[optionalId][i](this.Objects[optionalId]);
			}

			if (optionalId === this.CurrentObjId) {
				for (let i in this.CurrentChangeHandlers) {
					this.CurrentChangeHandlers[i](this.getCurrent());
				}
			}
		}
	};
}
