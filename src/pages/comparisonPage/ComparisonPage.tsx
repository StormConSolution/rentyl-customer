import React, { useEffect, useRef, useState } from 'react';
import './ComparisonPage.scss';
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
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import IconToolTip from '../../components/iconToolTip/IconToolTip';
import { ObjectUtils } from '../../utils/utils';

export interface TableData {
	description: JSX.Element[];
	guestLimit: JSX.Element[];
	extraBedding: JSX.Element[];
	features: JSX.Element[];
	adaCompliant: JSX.Element[];
}

const ComparisonPage: React.FC = () => {
	let accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const size = useWindowResizeChange();
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const comparisonRef = useRef(comparisonItems);
	const [accommodationTextList, setAccommodationTextList] = useState<(string | number)[]>([]);
	const [accommodationIdList, setAccommodationIdList] = useState<number[]>([]);
	const [accommodationDetailList, setAccommodationDetailList] = useState<Api.Accommodation.Res.Details[]>([]);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);

	useEffect(() => {
		let modifiedComparisonItems: ComparisonCardInfo[] = comparisonService.setDefaultAccommodations(comparisonItems);
		setComparisonItems(modifiedComparisonItems);
		setWaitToLoad(false);
		document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
	}, []);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate((newPath, previousPath) => {
			if (!ObjectUtils.isArrayWithData(comparisonRef.current))
				document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
			else document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.add('show');
		});
		return () => {
			router.unsubscribeFromBeforeRouterNavigate(id);
		};
	}, []);

	useEffect(() => {
		comparisonRef.current = comparisonItems;
		let accommodationTextArray: (string | number)[] = [];
		let accommodationIdArray: number[] = [];
		for (let item of comparisonItems) {
			let text: string | number = '';
			let id: number = -1;
			for (let roomType of item.roomTypes) {
				if (roomType.selected) {
					text = roomType.text;
					id = parseInt(String(roomType.value as number));
				}
			}
			accommodationTextArray.push(text);
			if (id !== -1) accommodationIdArray.push(id);
		}
		setAccommodationTextList(accommodationTextArray);
		setAccommodationIdList(accommodationIdArray);
	}, [comparisonItems]);

	useEffect(() => {
		async function getAccommodation() {
			try {
				let res = await accommodationService.getManyAccommodationDetails(accommodationIdList);
				setAccommodationDetailList(res);
			} catch (e) {
				rsToasts.error('An unexpected error has occurred on the server.');
				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {
						rsToasts.error('An unexpected error has occurred on the server.', '', 5000);
					}
				});
			}
		}
		getAccommodation().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accommodationIdList]);

	function pinAccommodationToFirstOfList(index: number) {
		if (index === 0) return;
		let modifiedComparisonItems = [...comparisonItems];
		modifiedComparisonItems.unshift(comparisonItems[index]);
		modifiedComparisonItems.splice(index + 1, 1);
		setComparisonItems(modifiedComparisonItems);
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
						placeHolder={accommodationTextList[index].toString()}
						roomTypes={item.roomTypes}
						onChange={(item) => {
							let newRecoilState = comparisonService.setSelectedAccommodation(
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
						popupOnClick={(pinToFirst) => {
							if (pinToFirst) pinAccommodationToFirstOfList(index);
							console.log('pinToFirst', pinToFirst);
							console.log('index', index);
						}}
					/>
				</td>
			);
		});
	}

	function renderAccommodationHeader() {
		let headerOutput: JSX.Element[] = [];
		headerOutput = [
			<th className={'comparisonCardsDiv'} key={'accommodation'}>
				<Label variant={'h4'}>Accommodation Type</Label>
			</th>
		];
		comparisonItems.map((item, index) => {
			headerOutput.push(
				<th key={index}>
					<Label variant={'h4'}>{accommodationTextList[index]}</Label>
				</th>
			);
		});
		return headerOutput;
	}

	function renderAccommodationCompare() {
		let output: JSX.Element[] = [];
		let table: TableData = {
			description: [
				<td key={'titleDescription'}>
					<Label variant={'h4'}>Description</Label>
				</td>
			],
			guestLimit: [
				<td key={'titleGuestLimit'}>
					<Label variant={'h4'}>Guest Limit</Label>
				</td>
			],
			extraBedding: [
				<td key={'titleExtraBedding'}>
					<Label variant={'h4'}>Extra Bedding</Label>
				</td>
			],
			features: [
				<td key={'titleFeatures'}>
					<Label variant={'h4'}>Features</Label>
				</td>
			],
			adaCompliant: [
				<td key={'titleAdaCompliant'}>
					<Label variant={'h4'}>Ada Compliant</Label>
				</td>
			]
		};

		if (!accommodationDetailList) return [];
		accommodationDetailList.map((accommodation, index) => {
			table.description.push(<td key={index}>{accommodation.longDescription}</td>);
			table.guestLimit.push(<td key={index}>{accommodation.maxOccupantCount}</td>);
			table.extraBedding.push(
				<td key={index}>{accommodation.extraBeds === 0 ? 'no' : 'yes' || accommodation.extraBeds}</td>
			);
			table.adaCompliant.push(
				<td key={index}>{accommodation.adaCompliant === 0 ? 'no' : 'yes' || accommodation.adaCompliant}</td>
			);
			if (!accommodation.features) return [];
			let featureList: JSX.Element[] = [];
			for (let feature of accommodation.features) {
				featureList.push(
					<IconToolTip
						iconImg={feature.icon}
						className={'featureIconLabel'}
						key={feature.title}
						title={feature.title}
					/>
				);
			}
			table.features.push(
				<td className={'features'} key={index}>
					{featureList}
				</td>
			);
		});

		const tableKeys = Object.keys(table);
		tableKeys.map((row, index) => {
			output.push(<tr key={index}>{table[row as keyof TableData]}</tr>);
		});
		return output;
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<Page className={'rsComparisonPage'}>
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
					<Label variant={'caption'} onClick={() => router.back()} className={'backNavigation'}>
						{'<'} back to previous page
					</Label>
					<table className={'comparisonTable'}>
						<thead>
							<tr className={'tableHeaderComparisonCard'} key={'trComparisonCard'}>
								<td className={'blankCell'} />
								{renderComparisonCard()}
							</tr>
							<tr className={'tableHeader'} key={'trRow'}>
								{renderAccommodationHeader()}
							</tr>
						</thead>
						<tbody className={'tableBody'}>{renderAccommodationCompare()}</tbody>
					</table>
				</Paper>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default ComparisonPage;
