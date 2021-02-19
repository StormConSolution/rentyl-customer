import Label from '@bit/redsky.framework.rs.label';
import React, { useState } from 'react';
import DestinationSummaryAccomodationList, {
	DestinationSummaryAccommodationListProps
} from '../destinationSummaryAccommodationList/DestinationSummaryAccommodationList';
import './TabbedDestinationSummary.scss';

interface DestinationSummaryTab {
	label: string;
	content: string | DestinationSummaryAccommodationListProps;
}

export interface TabbedDestinationSummaryProps {
	tabs: Array<DestinationSummaryTab>;
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

	function renderContents(tabs: Array<DestinationSummaryTab>): Array<JSX.Element> {
		return tabs.map((tab, index) => {
			return (
				<div key={index} className={'summaryContent' + (activeTabIndex === index ? ' active' : '')}>
					{typeof tab.content === 'string' ? tab.content : renderAccommodationList(tab.content)}
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
