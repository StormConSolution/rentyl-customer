import * as React from 'react';
import './CategoryImageGalleryMobile.scss';
import { useState } from 'react';
import Button from '@bit/redsky.framework.rs.button';
import { popupController } from '@bit/redsky.framework.rs.996';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Select from '../Select/Select';
import Carousel from '../carousel/Carousel';
import MobileLightBoxTwoPopup, {
	MobileLightBoxTwoPopupProps
} from '../../popups/mobileLightBoxTwoPopup/MobileLightBoxTwoPopup';
import { ObjectUtils } from '../../utils/utils';

interface CategoryImageGalleryMobileProps {
	accommodationCategories: Api.AccommodationCategory.Details[];
}

const CategoryImageGalleryMobile: React.FC<CategoryImageGalleryMobileProps> = (props) => {
	const [selected, setSelected] = useState<number>(0);

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
						text: item.title,
						selected: selected === item.id
					};
				} else {
					return {
						value: item.id,
						text: item.title,
						selected: selected === item.id
					};
				}
			})
			.filter((item) => item.value !== 'DELETE');
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
									imagePath: value.urls.large || ''
								};
							})
						});
					}}
				>
					<img src={item.urls.large} alt={item.title + ' image'} />
				</Button>
			);
		});
	}

	return (
		<Box className={'rsCategoryImageGalleryMobile'} width={'100%'}>
			<Box display={'flex'} justifyContent={'center'} marginBottom={'30px'}>
				<Select
					onChange={(value) => {
						if (value === null) return;
						let newValue: any = value;
						newValue = parseInt(newValue);
						setSelected(newValue);
					}}
					options={renderOptions()}
				/>
			</Box>
			<Carousel className={'imageContainer'} children={renderImages()} />
		</Box>
	);
};

export default CategoryImageGalleryMobile;
