import * as React from 'react';
import './CategoryFeatureIcons.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Icon from '@bit/redsky.framework.rs.icon';

interface CategoryFeatureIconsProps {
	title: string;
	features: { title: string; icon: string }[];
}

const CategoryFeatureIcons: React.FC<CategoryFeatureIconsProps> = (props) => {
	function renderFeatures() {
		return props.features.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} marginBottom={'25px'}>
					<Icon iconImg={item.icon} size={24} />
					<Label variant={'caption'}>{item.title}</Label>
				</Box>
			);
		});
	}

	return (
		<div className={'rsCategoryFeatureIcons'}>
			<Label variant={'h2'}>{props.title}</Label>
			<hr />
			<Box className={'featureIconWrapper'}>{renderFeatures()}</Box>
		</div>
	);
};

export default CategoryFeatureIcons;
