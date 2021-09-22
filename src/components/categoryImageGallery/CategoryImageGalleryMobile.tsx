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
	const [options, setOptions] = useState<OptionType[]>([]);
	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('roomValue', props.accommodationCategories[0].id, [])])
	);

	useEffect(() => {
		let newOptions = props.accommodationCategories.reduce((acc: OptionType[], item) => {
			if (ObjectUtils.isArrayWithData(item.media)) {
				acc.push({ value: item.id, label: item.title });
			}
			return acc;
		}, []);
		setOptions(newOptions);
		let updateRoomType = roomTypeFormGroup.getCloneDeep('roomValue');
		updateRoomType.value = newOptions[0].value;
		setRoomTypeFormGroup(roomTypeFormGroup.clone().update(updateRoomType));
	}, [props.accommodationCategories]);

	function renderImages(): React.ReactNodeArray {
		let selectedCategory: Api.AccommodationCategory.Details | undefined = props.accommodationCategories.find(
			(item) => {
				if (roomTypeFormGroup.get('roomValue').value !== 0) {
					return item.id === roomTypeFormGroup.get('roomValue').value;
				} else if (options.length >= 1) {
					return item.id === options[0].value;
				} else {
					return null;
				}
			}
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

	return (
		<Box className={'rsCategoryImageGalleryMobile'} width={'100%'}>
			<Box display={'flex'} justifyContent={'center'} marginBottom={'30px'}>
				<Select
					control={roomTypeFormGroup.get('roomValue')}
					updateControl={(control) => {
						setRoomTypeFormGroup(roomTypeFormGroup.clone().update(control));
					}}
					options={options}
				/>
			</Box>
			<Carousel className={'imageContainer'} children={renderImages()} />
		</Box>
	);
};

export default CategoryImageGalleryMobile;
