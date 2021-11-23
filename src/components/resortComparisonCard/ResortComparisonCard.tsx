import React, { useEffect, useState } from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ComparisonCardPopup, { ComparisonCardPopupProps } from '../../popups/comparisonCardPopup/ComparisonCardPopup';
import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import Img from '@bit/redsky.framework.rs.img';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import LoadingPage from '../../pages/loadingPage/LoadingPage';

interface ResortComparisonCardProps {
	destinationDetails: Misc.ComparisonCardInfo;
	handlePinToFirst?: (pinToFirst: boolean, comparisonId: number) => void;
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
