import * as React from 'react';
import './FilterBarDropDown.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { useState } from 'react';
import Button from '@bit/redsky.framework.rs.button';
import useOnClickOutsideRef from '../../customHooks/useOnClickOutsideRef';

interface FilterBarDropDownProps {
	title?: string;
	placeholder?: string;
	onChangeCallBack: () => void;
	onClearCallback: () => void;
	className?: string;
	dropdownContentClassName?: string;
}

const FilterBarDropDown: React.FC<FilterBarDropDownProps> = (props) => {
	const [toggleContent, setToggleContent] = useState<boolean>(false);
	const modalRef = useOnClickOutsideRef(() => {
		if (toggleContent) setToggleContent(false);
	});
	function applyBtnCallback() {
		if (props.onChangeCallBack) props.onChangeCallBack();
	}
	function onClearBtnCallBack() {
		if (props.onClearCallback) props.onClearCallback();
	}
	return (
		<div className="rsFilterBarDropDown">
			<Box
				className={`rsDropdownBtn${props.className ? ` ${props.className}` : ''}`}
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				onClick={() => setToggleContent((prevState) => !prevState)}
			>
				<Box id="labelContainer">
					<Label variant="caption2" className="filterByLabel" paddingBottom={4}>
						Filter By
					</Label>
					<Label variant="body3" className="filterTitleLabel">
						{props.title}
					</Label>
				</Box>
				<Box id="chevronIcon" className="chevronIcon">
					<Icon
						iconImg={`icon-chevron-thin-${toggleContent ? 'down' : 'up'}`}
						size={25}
						color={'#000000BD'}
					/>
				</Box>
			</Box>
			{toggleContent && (
				<Box boxRef={modalRef} className={`DropdownContent ${props.dropdownContentClassName || ''}`}>
					{props.children}
					<Box className="dropdownFooter" borderTop="1px solid #e0e0e0">
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							height="75px"
							paddingX="10px"
						>
							<Button look="none" onClick={onClearBtnCallBack}>
								clear
							</Button>
							<Button look="containedPrimary" onClick={applyBtnCallback}>
								Apply
							</Button>
						</Box>
					</Box>
				</Box>
			)}
		</div>
	);
};

export default FilterBarDropDown;
