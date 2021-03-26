import React from 'react';
import './PaginationButtons.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import IconLabel from '../iconLabel/IconLabel';

interface PaginationButtonsProps {
	className?: string;
	selectedRowsPerPage: number;
	index: number[];
	total: number;
	setSelectedPage: (page: number) => void;
	currentPageNumber: number;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = (props) => {
	const { selectedRowsPerPage, index, total, setSelectedPage, currentPageNumber } = props;

	const totalAvailablePages = Math.ceil(total / selectedRowsPerPage);

	function renderPageNumbers() {
		let numberArray = [];
		if (totalAvailablePages <= 6) {
			numberArray = Array.from(Array(totalAvailablePages + 1).keys());
			numberArray.shift();
			return numberArray;
		}
		numberArray.push(1);
		if (props.currentPageNumber < 4) {
			numberArray.push(...[2, 3, 4, '...', totalAvailablePages]);
			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber === totalAvailablePages - 2) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 1,
					props.currentPageNumber,
					props.currentPageNumber + 1,
					props.currentPageNumber + 2
				]
			);
			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber === totalAvailablePages - 1) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 2,
					props.currentPageNumber - 1,
					props.currentPageNumber,
					props.currentPageNumber + 1
				]
			);
			return numberArray;
		} else if (props.currentPageNumber >= 4 && props.currentPageNumber < totalAvailablePages) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 1,
					props.currentPageNumber,
					props.currentPageNumber + 1,
					'...',
					totalAvailablePages
				]
			);
			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber > totalAvailablePages - 2) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 3,
					props.currentPageNumber - 2,
					props.currentPageNumber - 1,
					props.currentPageNumber
				]
			);
			return numberArray;
		}
	}

	function renderNumberDisplay() {
		let pages: any = renderPageNumbers();
		if (!pages) return;
		let displayedPageNumbers = [];
		for (let i in pages) {
			displayedPageNumbers.push(
				<Label
					key={i}
					className={pages[i] === currentPageNumber ? 'pageNumberSelection selected' : 'pageNumberSelection'}
					onClick={() => {
						if (pages[i] !== '...') setSelectedPage(pages[i]);
					}}
				>
					{pages[i]}
				</Label>
			);
		}
		return displayedPageNumbers;
	}

	return totalAvailablePages < 1 ? (
		<div className={`rsPaginationButtons {props.className | ''}`} />
	) : (
		<div className={`rsPaginationButtons {props.className | ''}`}>
			<IconLabel
				className={props.currentPageNumber - 1 >= 1 ? 'pageNumberSelection' : 'notSelectable'}
				labelName={'back'}
				labelVariant={'caption'}
				iconImg={'icon-chevron-left'}
				iconPosition={'left'}
				iconSize={6}
				onClick={() => {
					if (props.currentPageNumber - 1 >= 1) {
						props.setSelectedPage(props.currentPageNumber - 1);
					}
				}}
			/>
			{renderNumberDisplay()}
			<IconLabel
				className={props.currentPageNumber + 1 <= totalAvailablePages ? 'pageNumberSelection' : 'notSelectable'}
				labelName={'next'}
				labelVariant={'caption'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={6}
				onClick={() => {
					if (props.currentPageNumber + 1 <= totalAvailablePages) {
						props.setSelectedPage(props.currentPageNumber + 1);
					}
				}}
			/>
		</div>
	);
};
export default PaginationButtons;
