import React from 'react';
import './RewardCategoryCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

interface RewardCategoryCardProps {
	value: number;
	title: string;
	imgPath: string;
	onClick: (categoryId: number) => void;
	className?: string;
}

const RewardCategoryCard: React.FC<RewardCategoryCardProps> = (props) => {
	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.imgPath}?tr=w-$556,tr=h-500)`,
			height: '250px',
			width: '278px',
			backgroundPosition: 'center',
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		};
		return styles;
	}

	return (
		<div
			className={`rsRewardCategoryCard ${props.className || ''}`}
			onClick={() => {
				props.onClick(props.value);
			}}
		>
			<div className={'image'} style={renderStyles()} />
			<Label className={'title'} variant={'h2'}>
				{props.title}
			</Label>
		</div>
	);
};

export default RewardCategoryCard;
