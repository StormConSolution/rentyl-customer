import Label from '@bit/redsky.framework.rs.label';
import React, { useState } from 'react';
import './TabbedDestinationSummary.scss';

interface DestinationSummaryTab {
	label: string;
	content: string;
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

	function renderContents(tabs: Array<DestinationSummaryTab>): Array<JSX.Element> {
		return tabs.map((tab, index) => {
			return (
				<div key={index} className={'summaryContent' + (activeTabIndex === index ? ' active' : '')}>
					{tab.content}
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
