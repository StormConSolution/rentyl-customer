import Label from '@bit/redsky.framework.rs.label';
import React, { useState } from 'react';
import DestinationSummaryAccomodationList, {
	DestinationSummaryAccommodationListProps
} from '../destinationSummaryAccommodationList/DestinationSummaryAccommodationList';
import DestinationSummaryOverview, {
	DestinationSummaryOverviewProps
} from '../destinationSummaryOverview/DestinationSummaryOverview';
import './TabbedDestinationSummary.scss';

export interface DestinationSummaryTab {
	label: string;
	content: string | DestinationSummaryAccommodationListProps | DestinationSummaryOverviewProps;
}

export interface TabbedDestinationSummaryProps {
	tabs: DestinationSummaryTab[];
}

const TabbedDestinationSummary: React.FC<TabbedDestinationSummaryProps> = (props) => {
	const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

	function renderTabs(tabs: Array<DestinationSummaryTab>): Array<JSX.Element> {
		return tabs.map((tab: DestinationSummaryTab, index: number) => {
			return (
				<div
					key={index}
					className={'tab' + (activeTabIndex === index ? ' active' : '')}
					onClick={() => {
						setActiveTabIndex(index);
					}}
				>
					<Label variant="caption">{tab.label}</Label>
				</div>
			);
		});
	}

	const isOverviewProp = (prop: object): prop is DestinationSummaryOverviewProps => prop.hasOwnProperty('text');
	const isAccommodationListProp = (prop: object): prop is DestinationSummaryOverviewProps =>
		prop.hasOwnProperty('accomodationType');

	function renderOverview(overviewProps: DestinationSummaryOverviewProps) {
		return (
			<DestinationSummaryOverview
				text={overviewProps.text}
				amenities={overviewProps.amenities}
				finePrint={overviewProps.finePrint}
				className={overviewProps.className}
			/>
		);
	}

	function renderAccommodationList(listProps: DestinationSummaryAccommodationListProps): JSX.Element {
		return (
			<DestinationSummaryAccomodationList
				accommodationType={listProps.accommodationType}
				accommodations={listProps.accommodations}
				onAddCompareClick={listProps.onAddCompareClick}
				onBookNowClick={listProps.onBookNowClick}
				onDetailsClick={listProps.onDetailsClick}
			/>
		);
	}

	function renderSingleContent(
		content: string | DestinationSummaryAccommodationListProps | DestinationSummaryOverviewProps
	) {
		if (typeof content === 'string') return <Label variant="body2">{content}</Label>;
		if (isOverviewProp(content)) return renderOverview(content);
		if (isAccommodationListProp(content)) return renderAccommodationList(content);
		return '';
	}

	function renderContents(tabs: DestinationSummaryTab[]): JSX.Element[] {
		return tabs.map((tab, index) => {
			return (
				<div key={index} className={'summaryContent' + (activeTabIndex === index ? ' active' : '')}>
					{renderSingleContent(tab.content)}
				</div>
			);
		});
	}

	return (
		<div className="rsTabbedDestinationSummary">
			<div className="tabSection">{renderTabs(props.tabs)}</div>
			<div className="contentSection">{renderContents(props.tabs)}</div>
		</div>
	);
};

export default TabbedDestinationSummary;
