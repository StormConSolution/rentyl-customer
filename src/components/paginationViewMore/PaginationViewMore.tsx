import Label from '@bit/redsky.framework.rs.label/dist/Label';
import './PaginationViewMore.scss';
import React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';

export interface PaginationViewMoreProps {
	className?: string;
	text?: string;
	selectedRowsPerPage: number;
	total: number;
	currentPageNumber: number;
	viewMore: (page: number) => void;
	variant?: Misc.Variant;
}
const PaginationViewMore: React.FC<PaginationViewMoreProps> = (props) => {
	function hasMore() {
		return props.currentPageNumber * props.selectedRowsPerPage < props.total;
	}
	return (
		<Box className={`rsPaginationViewMore ${props.className || ''}`}>
			{hasMore() && (
				<Label
					variant={props.variant || 'body1'}
					onClick={() => {
						props.viewMore(props.currentPageNumber + 1);
					}}
				>
					{props.text || 'Load More'}
				</Label>
			)}
		</Box>
	);
};

export default PaginationViewMore;
