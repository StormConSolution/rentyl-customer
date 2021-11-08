import {
	atom,
	Loadable,
	RecoilState,
	RecoilValue,
	useRecoilCallback,
	useRecoilTransactionObserver_UNSTABLE
} from 'recoil';
import * as React from 'react';

enum GlobalStateKeys {
	COMPARISON_CARD = 'DestinationComparison',
	USER_TOKEN = 'UserToken',
	USER = 'User',
	COMPANY = 'Company',
	VERIFIED_ACCOMMODATIONS = 'VerifiedAccommodations',
	USER_RATE_CODE = 'UserRateCode',
	RESERVATION_FILTERS = 'ReservationFilter'
}

// Change based on project so we don't have classing when developing on localhost (va = Volcanic Admin)
const KEY_PREFIX = 'spireCust-';

class GlobalState {
	destinationComparison: RecoilState<Misc.ComparisonCardInfo[]>;
	userToken: RecoilState<string>;
	user: RecoilState<Api.User.Res.Detail | undefined>;
	company: RecoilState<Api.Company.Res.GetCompanyAndClientVariables>;
	verifiedAccommodations: RecoilState<{ [uuid: number]: Api.Reservation.Res.Verification }>;
	userRateCode: RecoilState<string>;
	reservationFilters: RecoilState<Misc.ReservationFilters>;

	saveToStorageList: string[] = [];

	constructor() {
		this.destinationComparison = atom<Misc.ComparisonCardInfo[]>({
			key: GlobalStateKeys.COMPARISON_CARD,
			default: this.loadFromLocalStorage<Misc.ComparisonCardInfo[]>(GlobalStateKeys.COMPARISON_CARD, [])
		});

		this.user = atom<Api.User.Res.Detail | undefined>({
			key: GlobalStateKeys.USER,
			default: undefined
		});

		this.userToken = atom<string>({
			key: GlobalStateKeys.USER_TOKEN,
			default: this.loadFromLocalStorage<string>(GlobalStateKeys.USER_TOKEN, '')
		});

		this.company = atom<Api.Company.Res.GetCompanyAndClientVariables>({
			key: GlobalStateKeys.COMPANY,
			default: {
				id: 0,
				name: '',
				squareLogoUrl: '',
				wideLogoUrl: '',
				allowPointBooking: 0,
				allowCashBooking: 0,
				customPages: {},
				unauthorizedPages: []
			}
		});

		this.verifiedAccommodations = atom<{ [uuid: number]: Api.Reservation.Res.Verification }>({
			key: GlobalStateKeys.VERIFIED_ACCOMMODATIONS,
			default: {}
		});

		// The following is stored in local storage automatically
		this.saveToStorageList = [GlobalStateKeys.USER_TOKEN, GlobalStateKeys.COMPARISON_CARD];

		this.userRateCode = atom<string>({
			key: GlobalStateKeys.USER_RATE_CODE,
			default: ''
		});

		this.reservationFilters = atom<Misc.ReservationFilters>({
			key: GlobalStateKeys.RESERVATION_FILTERS,
			default: {
				location: 0,
				checkIn: new Date(),
				checkOut: new Date(),
				adultCount: 1,
				redeemPoints: true,
				sortBy: 'ASC'
			}
		});
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
		for (const item of snapshot.getNodes_UNSTABLE({ isModified: true })) {
			let value = snapshot.getLoadable(item).contents as string;
			if (process.env.NODE_ENV === 'development') {
				console.log('Recoil item changed: ', item.key);
				console.log('Value: ', value);
			}

			if (globalState.saveToStorageList.includes(item.key)) {
				if (typeof value === 'object') value = JSON.stringify(value);
				localStorage.setItem(KEY_PREFIX + item.key, value);
			}
		}
	});
	return null;
};

const globalState = new GlobalState();
export default globalState;

/**
 * Returns a Recoil state value, from anywhere in the app.
 *
 * Can be used outside of the React tree (outside a React component), such as in utility scripts, etc.

 * <GlobalStateInfluencer> must have been previously loaded in the React tree, or it won't work.
 * Initialized as a dummy function "() => null", it's reference is updated to a proper Recoil state mutator when GlobalStateInfluencer is loaded.
 *
 * @example const lastCreatedUser = getRecoilExternalValue(lastCreatedUserState);
 *
  */
export let getRecoilExternalLoadable: <T>(recoilValue: RecoilValue<T>) => Loadable<T> = () => null as any;

/**
 * Retrieves the value from the loadable. More information about loadables are here:
 * https://recoiljs.org/docs/api-reference/core/Loadable
 * @param recoilValue Recoil value to retrieve its base value
 */
export function getRecoilExternalValue<T>(recoilValue: RecoilValue<T>): T {
	return getRecoilExternalLoadable<T>(recoilValue).getValue();
}

/**
 * Sets a Recoil state value, from anywhere in the app.
 *
 * Can be used outside of the React tree (outside a React component), such as in utility scripts, etc.
 *
 * <RecoilExternalStatePortal> must have been previously loaded in the React tree, or it won't work.
 * Initialized as a dummy function "() => null", it's reference is updated to a proper Recoil state mutator when GlobalStateInfluencer is loaded.
 *
 * NOTE - Recoil value isn't fully changed until some time later.
 *
 * @example setRecoilExternalState(lastCreatedUserState, newUser)
 */
export let setRecoilExternalValue: <T>(
	recoilState: RecoilState<T>,
	valOrUpdater: ((currVal: T) => T) | T
) => void = () => null as any;

export const GlobalStateInfluencer: React.FC = () => {
	useRecoilCallback(({ set, snapshot }) => {
		setRecoilExternalValue = set;
		getRecoilExternalLoadable = snapshot.getLoadable;
		return async () => {};
	})();

	// We need to update the getRecoilExternalLoadable every time there's a new snapshot
	// Otherwise we will load old values from when the component was mounted
	useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
		getRecoilExternalLoadable = snapshot.getLoadable;
	});

	return null;
};
