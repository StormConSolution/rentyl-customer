import * as React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import CategoryImageGalleryMobile from './CategoryImageGalleryMobile';
import CategoryImageGalleryResponsive from './CategoryImageGalleryResponsive';

interface CategoryImageGalleryProps {
	accommodationCategories: Api.AccommodationCategory.Details[];
}

const CategoryImageGallery: React.FC<CategoryImageGalleryProps> = (props) => {
	const size = useWindowResizeChange();
	return size === 'small' ? (
		<CategoryImageGalleryMobile accommodationCategories={props.accommodationCategories} />
	) : (
		<CategoryImageGalleryResponsive accommodationCategories={props.accommodationCategories} />
	);
};

export default CategoryImageGallery;
