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
import { ObjectUtils, WebUtils } from '../../utils/utils';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

interface CategoryImageGalleryMobileProps {
	accommodationCategories: Api.AccommodationCategory.Details[];
}

const CategoryImageGalleryMobile: React.FC<CategoryImageGalleryMobileProps> = (props) => {
	const [options, setOptions] = useState<OptionType[]>([]);
	const [defaultValue, setDefaultValue] = useState<OptionType>();
	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('roomValue', 0, [])])
	);

	useEffect(() => {
		async function renderOptions() {
			try {
				let firstRun = true;
				let newOptions = props.accommodationCategories
					.map((item, index) => {
						if (roomTypeFormGroup.get('roomValue').value !== 0 && firstRun) {
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
				setOptions(newOptions);
				setDefaultValue({ value: newOptions[0].value, label: newOptions[0].label });
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
			}
		}
		renderOptions().catch(console.error);
	}, [roomTypeFormGroup]);

	function renderImages(): React.ReactNodeArray {
		let selectedCategory: Api.AccommodationCategory.Details | undefined = props.accommodationCategories.find(
			(item) => {
				if (roomTypeFormGroup.get('roomValue').value !== 0) {
					return item.id === roomTypeFormGroup.get('roomValue').value;
				} else if (options.length >= 1) {
					return item.id === options[0].value;
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
					defaultValue={defaultValue}
				/>
			</Box>
			<Carousel className={'imageContainer'} children={renderImages()} />
		</Box>
	);
};

export default CategoryImageGalleryMobile;
