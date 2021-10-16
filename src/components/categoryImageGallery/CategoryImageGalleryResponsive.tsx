import * as React from 'react';
import './CategoryImageGalleryResponsive.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Button from '@bit/redsky.framework.rs.button';
import LabelButton from '../labelButton/LabelButton';
import { useState } from 'react';
import { popupController } from '@bit/redsky.framework.rs.996';
import LightBoxTwoPopup, { LightBoxTwoPopupProps } from '../../popups/lightBoxTwoPopup/LightBoxTwoPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { ObjectUtils } from '@bit/redsky.framework.rs.http/dist/Utils';
import Img from '@bit/redsky.framework.rs.img';

interface CategoryImageGalleryResponsiveProps {
	accommodationCategories: Api.AccommodationCategory.Details[];
}

const CategoryImageGalleryResponsive: React.FC<CategoryImageGalleryResponsiveProps> = (props) => {
	const [selected, setSelected] = useState<number>(0);
	const size = useWindowResizeChange();

	function renderTabs() {
		let firstRun = true;
		return props.accommodationCategories.map((item, index) => {
			if (!selected && firstRun) {
				setSelected(item.id);
				firstRun = false;
			}
			if (!ObjectUtils.isArrayWithData(item.media)) return false;
			else
				return (
					<LabelButton
						key={item.id}
						look={'none'}
						variant={'button'}
						className={`tab ${selected === item.id ? 'selected' : ''}`}
						label={item.title}
						onClick={() => {
							setSelected(item.id);
						}}
					/>
				);
		});
	}

	function renderImages() {
		let selectedCategory: Api.AccommodationCategory.Details | undefined = props.accommodationCategories.find(
			(item) => item.id === selected
		);
		if (!selectedCategory) return '';
		return selectedCategory.media.map((item, index) => {
			return (
				<Button
					key={item.id}
					look={'none'}
					className={'imageTiles'}
					onClick={() => {
						popupController.open<LightBoxTwoPopupProps>(LightBoxTwoPopup, {
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
					<Img
						src={item.urls.imageKit}
						alt={item.title + ' image'}
						width={300}
						height={250}
						rootMargin={'0px 0px 500px 0px'}
					/>
				</Button>
			);
		});
	}

	return (
		<Box className={'rsCategoryImageGalleryResponsive'} width={'100%'}>
			<Box display={'flex'} justifyContent={'center'} marginBottom={'30px'}>
				{renderTabs()}
			</Box>
			<Box className={'imageContainer'}>{renderImages()}</Box>
		</Box>
	);
};

export default CategoryImageGalleryResponsive;
