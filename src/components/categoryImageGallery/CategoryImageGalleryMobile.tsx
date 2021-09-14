import * as React from 'react';
import './CategoryImageGalleryMobile.scss';
import { useEffect, useState } from 'react';
import Button from '@bit/redsky.framework.rs.button';
import { popupController } from '@bit/redsky.framework.rs.996';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Carousel from '../carousel/Carousel';
import MobileLightBoxTwoPopup, {
	MobileLightBoxTwoPopupProps
} from '../../popups/mobileLightBoxTwoPopup/MobileLightBoxTwoPopup';
import { ObjectUtils } from '../../utils/utils';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

interface CategoryImageGalleryMobileProps {
	accommodationCategories: Api.AccommodationCategory.Details[];
}

const CategoryImageGalleryMobile: React.FC<CategoryImageGalleryMobileProps> = (props) => {
	const [selected, setSelected] = useState<number>(0);
	const [roomTypeFormGroup] = useState<RsFormGroup>(new RsFormGroup([new RsFormControl('roomValue', 0, [])]));

	function renderOptions() {
		let firstRun = true;
		return props.accommodationCategories
			.map((item, index) => {
				if (!selected && firstRun) {
					setSelected(item.id);
					firstRun = false;
				}
				if (!ObjectUtils.isArrayWithData(item.media)) {
					return {
						value: 'DELETE',
						label: item.title
					};
				} else {
					return {
						value: item.id,
						label: item.title
					};
				}
			})
			.filter((item) => item.value !== 'DELETE');
	}

	function renderDefault() {
		let options = renderOptions();
		if (options.length > 0) return { value: options[0].value, label: options[0].label };
		return { value: 0, label: 'Select...' };
	}

	function renderImages(): React.ReactNodeArray {
		let selectedCategory: Api.AccommodationCategory.Details | undefined = props.accommodationCategories.find(
			(item) => item.id === selected
		);
		if (!selectedCategory) return [<div />];
		return selectedCategory.media.map((item, index) => {
			return (
				<Button
					key={item.id}
					look={'none'}
					className={'imageTiles'}
					disableRipple
					onClick={() => {
						popupController.open<MobileLightBoxTwoPopupProps>(MobileLightBoxTwoPopup, {
							imageIndex: index,
							imageDataArray: selectedCategory!.media.map((value) => {
								return {
									title: value.title,
									description: value.description,
									imagePath: value.urls.imageKit || ''
								};
							})
						});
					}}
				>
					<img src={item.urls.imageKit} alt={item.title + ' image'} />
				</Button>
			);
		});
	}

	function handleSelected(value: RsFormControl) {
		if (value.value === null) return;
		let newValue: any = value.value;
		newValue = parseInt(newValue);
		setSelected(newValue);
	}

	return (
		<Box className={'rsCategoryImageGalleryMobile'} width={'100%'}>
			<Box display={'flex'} justifyContent={'center'} marginBottom={'30px'}>
				<Select
					control={roomTypeFormGroup.get('roomValue')}
					updateControl={(value) => {
						handleSelected(value);
					}}
					options={renderOptions()}
					defaultValue={renderDefault()}
				/>
			</Box>
			<Carousel className={'imageContainer'} children={renderImages()} />
		</Box>
	);
};

export default CategoryImageGalleryMobile;
