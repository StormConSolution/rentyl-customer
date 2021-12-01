import React from 'react';
import './ResortComparisonCard.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Img from '@bit/redsky.framework.rs.img';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';

interface ResortComparisonCardProps {
	destinationDetails: Misc.ComparisonCardInfo;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');

	function handleOnClose() {
		comparisonService.removeFromComparison(props.destinationDetails.destinationId);
	}

	return (
		<div className={`rsResortComparisonCard`}>
			<div className={'imageContainer'}>
				<Img src={props.destinationDetails.logo} alt={'resort logo'} width={'178px'} height={'auto'} />
			</div>
			<Icon className={'close'} iconImg={'icon-close'} onClick={handleOnClose} size={20} cursorPointer />
		</div>
	);
};

export default ResortComparisonCard;
