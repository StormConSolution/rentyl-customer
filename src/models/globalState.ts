import { atom, RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import * as React from 'react';

enum GlobalStateKeys {
	ADMIN_TOKEN = 'AdminToken',
	THEME = 'Theme'
}

// Change based on project so we don't have classing when developing on localhost (va = Volcanic Admin)
const KEY_PREFIX = 'vadm-';

export type AvailableThemes = 'green' | 'blue';

class GlobalState {
	adminToken: RecoilState<string>;
	theme: RecoilState<AvailableThemes>;

	saveToStorageList: { key: string; state: RecoilState<any> }[] = [];

	constructor() {
		this.adminToken = atom<string>({
			key: GlobalStateKeys.ADMIN_TOKEN,
			default: this.loadFromLocalStorage<string>(GlobalStateKeys.ADMIN_TOKEN, '')
		});

		// Uncomment below if you want to have it save to local storage
		this.saveToStorageList.push({ key: GlobalStateKeys.ADMIN_TOKEN, state: this.adminToken });

		this.theme = atom<AvailableThemes>({
			key: GlobalStateKeys.THEME,
			default: this.loadFromLocalStorage<AvailableThemes>(GlobalStateKeys.THEME, 'blue')
		});

		// Uncomment below if you want to have it save to local storage
		this.saveToStorageList.push({ key: GlobalStateKeys.THEME, state: this.theme });
	}

	private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
		let item = localStorage.getItem(KEY_PREFIX + key);
		if (!item) return defaultValue;
		try {
			item = JSON.parse(item);
		} catch (e) {}
		// @ts-ignore
		return item;
	}
}

export function clearPersistentState() {
	// All we really need to do is clear local storage
	localStorage.clear();
}

export const GlobalStateObserver: React.FC = () => {
	useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
		for (let storageItems of globalState.saveToStorageList) {
			localStorage.setItem(
				KEY_PREFIX + storageItems.key,
				JSON.stringify(snapshot.getLoadable(storageItems.state).contents)
			);
		}
	});

	return null;
};

const globalState = new GlobalState();
export default globalState;
