import * as React from 'react';
import './MultiSelect.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { useEffect, useRef, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import MultiSelectOption from './multiSelectOption/MultiSelectOption';
import Label from '@bit/redsky.framework.rs.label';

interface SpireSelectProps {
	placeHolder?: string;
	showSelectedAsPlaceHolder?: boolean;
	onChange: (value: (string | number)[]) => void;
	options: { value: number | string; text: number | string; selected?: boolean }[];
}

const MultiSelect: React.FC<SpireSelectProps> = (props) => {
	const popupRef = useRef<HTMLElement>(null);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [selectedValueArray, setSelectedValueArray] = useState<(number | string)[]>(getInitialSelectedData('value'));
	const [selectedTextArray, setSelectedTextArray] = useState<(number | string)[]>(getInitialSelectedData('text'));

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (popupRef && popupRef.current && !popupRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	function getInitialSelectedData(type: 'value' | 'text') {
		return props.options
			.filter((item) => {
				return item.selected;
			})
			.map((item) => {
				return item[type];
			});
	}

	function renderOptions() {
		return props.options.map((item, index) => {
			return (
				<MultiSelectOption
					key={index}
					value={item.value}
					text={item.text}
					onSelect={(value, text) => {
						setSelectedValueArray([...selectedValueArray, value]);
						setSelectedTextArray([...selectedTextArray, text]);
						props.onChange([...selectedValueArray, value]);
					}}
					onDeselect={(value, text) => {
						setSelectedValueArray(selectedValueArray.filter((item) => item !== value));
						setSelectedTextArray(selectedTextArray.filter((item) => item !== text));
						props.onChange(selectedValueArray.filter((item) => item !== value));
					}}
					selected={item.selected}
				/>
			);
		});
	}

	function renderPlaceHolder() {
		if (!!props.placeHolder && props.showSelectedAsPlaceHolder && selectedTextArray.length === 0) {
			return props.placeHolder;
		} else if (props.showSelectedAsPlaceHolder) {
			return <Label variant={'body1'}>{selectedTextArray.join(', ')}</Label>;
		} else if (!!props.placeHolder) {
			return props.placeHolder;
		}
	}

	return (
		<div ref={popupRef} className={'rsMultiSelect'}>
			<Box
				className={'placeHolder'}
				display={'flex'}
				alignItems={'center'}
				justifyContent={'space-between'}
				onClick={() => setShowOptions(!showOptions)}
			>
				{renderPlaceHolder()}
				<Icon
					iconImg={'icon-chevron-down'}
					className={showOptions ? 'iconSpinDown' : 'iconSpinUp'}
					color={'#dedede'}
				/>
			</Box>

			<div className={showOptions ? 'optionList show' : 'optionList'}>{renderOptions()}</div>
		</div>
	);
};

export default MultiSelect;
