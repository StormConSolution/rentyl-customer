import React, { useEffect, useState } from 'react';
import './CompareDestinationsOrAccommodationsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LabelLink from '../../components/labelLink/LabelLink';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import { useRecoilState } from 'recoil';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import rsToasts from '@bit/redsky.framework.toast';
import { HttpStatusCode } from '../../utils/http';
import { axiosErrorHandler } from '../../utils/errorHandler';
import DestinationService from '../../services/destination/destination.service';
import AccommodationService from '../../services/accommodation/accommodation.service';

// these will live in api when the endpoints are done
export interface AccommodationData {
	id: string;
	totalRooms: number;
	bedrooms: number;
	kitchens: number;
	beds: number;
	wifi: string;
	tv: number;
}

export interface DestinationData {
	id: string;
	pool: number;
	roomService: string;
	rating: number;
	numberOfFloors: number;
	spa: string;
}

const CompareDestinations: React.FC = () => {
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	let accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const size = useWindowResizeChange();
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const [accommodationSelected, setAccommodationSelected] = useState<number>(0);
	const [destinationSelected, setDestinationSelected] = useState<number>(0);
	const [renderDestinationTable, setRenderDestinationTable] = useState<boolean>(true);
	const [tableBody, setTableBody] = useState<JSX.Element[]>([]);
	const [tableHeaderRow, setTableHeaderRow] = useState<JSX.Element[]>([]);
	const [compareItemsSelected, setCompareItemsSelected] = useState<(string | number)[]>([]);
	let output: JSX.Element[] = [];
	let headerOutput: JSX.Element[] = [];

	// destinations and accommodations will be pulled from server
	let destinations: DestinationData[] = [
		{ id: '1', pool: 4, roomService: 'available 24/7', rating: 4, numberOfFloors: 7, spa: 'hours 8am-10pm' },
		{
			id: '2',
			pool: 3,
			roomService: 'available from 5am-11pm',
			rating: 3,
			numberOfFloors: 5,
			spa: 'hours 9am-9pm'
		},
		{
			id: '3',
			pool: 2,
			roomService: 'available from 4am-10pm',
			rating: 3,
			numberOfFloors: 4,
			spa: 'hours 10am-7pm'
		}
	];
	let accommodations: AccommodationData[] = [
		{ id: '1', totalRooms: 1, bedrooms: 0, kitchens: 1, beds: 2, wifi: 'free', tv: 1 },
		{ id: '2', totalRooms: 2, bedrooms: 1, kitchens: 1, beds: 3, wifi: 'available for purchase', tv: 2 },
		{ id: '3', totalRooms: 3, bedrooms: 2, kitchens: 1, beds: 4, wifi: 'free', tv: 3 }
	];

	useEffect(() => {
		setPageVariables();
	}, [comparisonItems]);

	useEffect(() => {
		if (comparisonItems.length !== 0) {
			//not using data from server yet
			if (renderDestinationTable) {
				getDestinations().catch(console.error);
				renderDestinationCompare();
			} else {
				getAccommodation().catch(console.error);
				renderAccommodationCompare();
			}
		} else {
			setTableBody([]);
			setTableHeaderRow([]);
			rsToasts.error('No destinations or accommodations selected to compare.');
		}
		async function getDestinations() {
			try {
				let res = await destinationService.getDestinationDetails(1);
				console.log(res);
			} catch (e) {
				rsToasts.error('uh oh something went wrong.');
				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {
						rsToasts.error('uh oh something went wrong.');
					}
				});
			}
		}
		async function getAccommodation() {
			try {
				let res = await accommodationService.getAccommodationDetails(1);
				console.log(res);
			} catch (e) {
				rsToasts.error('uh oh something went wrong.');
				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {
						rsToasts.error('uh oh something went wrong.');
					}
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accommodationSelected, destinationSelected, renderDestinationTable, compareItemsSelected]);

	function setDestinationVariables() {
		if (comparisonItems.length === 0) {
			setDestinationSelected(0);
			return;
		}
		setDestinationSelected(comparisonItems.length);
	}

	function setAccommodationVariables() {
		let numberOfAccommodation = 0;
		let selectedArray: (string | number)[] = [];
		for (let item of comparisonItems) {
			if (item.roomTypes === undefined) continue;
			let selected: string | number = '';
			for (let roomType of item.roomTypes) {
				if (roomType.selected) {
					selected = roomType.text;
					numberOfAccommodation++;
				}
			}
			selectedArray.push(selected);
		}
		setCompareItemsSelected(selectedArray);
		if (numberOfAccommodation === comparisonItems.length || numberOfAccommodation >= 2) {
			setRenderDestinationTable(false);
		} else {
			setRenderDestinationTable(true);
		}
		setAccommodationSelected(numberOfAccommodation);
	}

	function setPageVariables() {
		setDestinationVariables();
		setAccommodationVariables();
	}

	function renderComparisonCard() {
		if (!comparisonItems || comparisonItems.length > 3) return;
		return comparisonItems.map((item, index) => {
			return (
				<td key={index}>
					<ResortComparisonCard
						key={index}
						logo={item.logo}
						title={item.title}
						roomTypes={item.roomTypes}
						onChange={(item) => {
							let newRecoilState = comparisonService.resortComparisonCardOnChange(
								index,
								item,
								comparisonItems
							);
							setComparisonItems(newRecoilState);
						}}
						onClose={() => {
							let newComparisonItems = comparisonService.resortComparisonCardOnClose(
								item,
								comparisonItems
							);
							setComparisonItems(newComparisonItems);
						}}
					/>
				</td>
			);
		});
	}

	function renderAccommodationHeader() {
		headerOutput = [
			<th className={'comparisonCardsDiv'} key={'accommodation'}>
				<Label variant={'h4'}>Accommodation Type</Label>
			</th>
		];
		comparisonItems.map((item, index) => {
			headerOutput.push(
				<th key={index}>
					<Label variant={'h4'}>{compareItemsSelected[index]}</Label>
				</th>
			);
		});
		setTableHeaderRow(headerOutput);
	}

	function renderAccommodationCompare() {
		renderAccommodationHeader();
		let accommodationKeys = Object.keys(accommodations[0]);
		accommodationKeys.map((itemKey, indexKey) => {
			if (itemKey !== 'id') {
				let res = accommodations.map((itemAccommodation, indexAccommodation) => {
					if (
						compareItemsSelected[indexAccommodation] === '' ||
						compareItemsSelected[indexAccommodation] === undefined
					)
						return <td key={indexAccommodation} />;
					return <td key={indexAccommodation}>{itemAccommodation[itemKey as keyof AccommodationData]}</td>;
				});
				output.push(
					<tr key={indexKey}>
						<td key={`rowDescription${indexKey}`}>{itemKey}</td>
						{res}
					</tr>
				);
			}
			return output;
		});
		setTableBody(output);
	}

	function renderDestinationHeader() {
		headerOutput = [
			<th className={'comparisonCardsDiv'} key={'destination'}>
				<Label variant={'h4'}>Destination Name</Label>
			</th>
		];
		comparisonItems.map((item, index) => {
			if (!compareItemsSelected[index]) {
				headerOutput.push(
					<th key={index}>
						<Label variant={'h4'}>{item.title}</Label>
					</th>
				);
			} else {
				headerOutput.push(<th key={index} />);
			}
		});
		setTableHeaderRow(headerOutput);
	}

	function renderDestinationCompare() {
		renderDestinationHeader();
		let destinationKeys = Object.keys(destinations[0]);
		destinationKeys.map((itemKey, indexKey) => {
			if (itemKey !== 'id') {
				let res = destinations.map((itemDestinations, indexDestinations) => {
					if (
						compareItemsSelected[indexDestinations] ||
						compareItemsSelected[indexDestinations] === undefined
					) {
						return <td key={indexDestinations} />;
					} else {
						return <td key={indexDestinations}>{itemDestinations[itemKey as keyof DestinationData]}</td>;
					}
				});
				output.push(
					<tr key={indexKey}>
						<td key={`rowDescription${indexKey}`}>{itemKey}</td>
						{res}
					</tr>
				);
			}
			return output;
		});
		setTableBody(output);
	}

	return (
		<Page className={'rsCompareDestinations'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>
				<Paper
					className={'formPaper'}
					width={'100%'}
					height={'100%'}
					backgroundColor={'#FFFFFF'}
					padding={size === 'small' ? '5px' : '0'}
				>
					<LabelLink
						className={'destinationPath'}
						path={'/'}
						label={'back to destination results'}
						variant={'caption'}
						iconLeft={'icon-chevron-left'}
						iconSize={8}
						iconColor={'#004b98'}
					/>
					<table className={'destinationOrAccommodationTable'}>
						<thead>
							<tr className={'tableHeader'} key={'trComparisonCard'}>
								<td className={'blankCell'} />
								{renderComparisonCard()}
							</tr>
							<tr className={'tableHeader'} key={'trRow'}>
								{tableHeaderRow}
							</tr>
						</thead>
						<tbody className={'tableBody'}>{tableBody}</tbody>
					</table>
				</Paper>
			</div>
		</Page>
	);
};

export default CompareDestinations;
