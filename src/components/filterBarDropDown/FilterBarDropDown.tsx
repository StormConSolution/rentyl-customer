import * as React from 'react';
import './FilterBarDropDown.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { useState } from 'react';
import LabelButton from '../labelButton/LabelButton';
import useOnClickOutsideRef from '../../customHooks/useOnClickOutsideRef';

interface FilterBarDropDownProps {
	title?: string | React.ReactNode;
	placeholder?: string;
	onChangeCallBack: () => void;
	onClearCallback: () => void;
	isSortField?: boolean;
	removeFilterByLabel?: boolean;
	className?: string;
	dropdownContentClassName?: string;
	icon?: string;
}

const FilterBarDropDown: React.FC<FilterBarDropDownProps> = (props) => {
	const [toggleContent, setToggleContent] = useState<boolean>(false);
	const modalRef = useOnClickOutsideRef(() => {
		if (toggleContent) setToggleContent(false);
	});
	function applyBtnCallback() {
		if (props.onChangeCallBack) props.onChangeCallBack();
		setToggleContent(false);
	}
	function onClearBtnCallBack() {
		if (props.onClearCallback) props.onClearCallback();
		if (props.onChangeCallBack) props.onChangeCallBack();
		setToggleContent(false);
	}
	return (
		<div className="rsFilterBarDropDown">
			<Box
				className={`rsDropdownBtn${props.className ? ` ${props.className}` : ''}`}
				display="flex"
				justifyContent="start"
				alignItems="center"
				onClick={() => setToggleContent((prevState) => !prevState)}
				height={props.removeFilterByLabel ? '62%' : 'auto'}
			>
				<Box id="labelContainer">
					{!props.removeFilterByLabel && (
						<Label variant="caption2" className="filterByLabel" paddingBottom={4}>
							{props.isSortField ? 'Sort By' : 'Filter By'}
						</Label>
					)}
					<Label className="filterTitleLabel">{props.title}</Label>
				</Box>
				<Box id="chevronIcon" className="chevronIcon">
					<Icon
						iconImg={props.icon ? props.icon : `icon-chevron-thin-${toggleContent ? 'down' : 'up'}`}
						size={25}
						color={'#000000BD'}
					/>
				</Box>
			</Box>
			{toggleContent && (
				<Box boxRef={modalRef} className={`dropdownContent ${props.dropdownContentClassName || ''}`}>
					{props.children}
					{!props.isSortField && (
						<Box className="dropdownFooter">
							<LabelButton variant="body1" label="Clear" look="none" onClick={onClearBtnCallBack} />
							<LabelButton
								variant="body2"
								label="Apply"
								look="containedPrimary"
								onClick={applyBtnCallback}
							/>
						</Box>
					)}
				</Box>
			)}
		</div>
	);
};

export default FilterBarDropDown;
