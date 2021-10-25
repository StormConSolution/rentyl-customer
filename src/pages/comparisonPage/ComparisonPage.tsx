import React, { useEffect, useRef, useState } from 'react';
import './ComparisonPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import { useRecoilState } from 'recoil';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import { HttpStatusCode } from '../../utils/http';
import { axiosErrorHandler } from '../../utils/errorHandler';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import IconToolTip from '../../components/iconToolTip/IconToolTip';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

export interface TableData {
	description?: JSX.Element[];
	guestLimit: JSX.Element[];
	extraBedding: JSX.Element[];
	features: JSX.Element[];
	adaCompliant: JSX.Element[];
}

const ComparisonPage: React.FC = () => {
	const size = useWindowResizeChange();
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<Misc.ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const comparisonRef = useRef(comparisonItems);
	const [accommodationTextList, setAccommodationTextList] = useState<(string | number)[]>([]);
	const [accommodationIdList, setAccommodationIdList] = useState<number[]>([]);
	const [accommodationDetailList, setAccommodationDetailList] = useState<Api.Accommodation.Res.Details[]>([]);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);

	useEffect(() => {
		let modifiedComparisonItems: Misc.ComparisonCardInfo[] = comparisonService.setDefaultAccommodations(
			comparisonItems
		);
		setComparisonItems(modifiedComparisonItems);
		setWaitToLoad(false);
		document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
	}, []);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate(() => {
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
					id = +roomType.value;
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
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get details for these locations'),
					'Server Error'
				);

				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {
						rsToastify.error(
							WebUtils.getRsErrorMessage(e, 'Unable to get details for these locations.'),
							'Server Error'
						);
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
						selectedRoom={item.selectedRoom}
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
				<Label variant={'h4'}>Property Type</Label>
			</th>
		];
		comparisonItems.forEach((item, index) => {
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
					<Label variant={'h4'}>Accessible</Label>
				</td>
			]
		};
		if (size === 'small') {
			delete table.description;
		}

		if (!accommodationDetailList) return [];
		accommodationDetailList.forEach((accommodation, index) => {
			if (table.description && size !== 'small') {
				table.description.push(<td key={index}>{accommodation.longDescription}</td>);
			}
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
				<td key={index}>
					<div className={'features'}>{featureList}</div>
				</td>
			);
		});

		const tableKeys = Object.keys(table);
		tableKeys.forEach((row, index) => {
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
					{size === 'small' ? (
						<div className={'tableContainer'}>
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
						</div>
					) : (
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
					)}
				</Paper>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default ComparisonPage;
