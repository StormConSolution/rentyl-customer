import * as React from 'react';
import './StarRatingSelect.scss';
import { ReactNodeArray, useEffect, useState } from 'react';
import { Box } from '@bit/redsky.framework.rs.996';

interface StarRatingSelectProps {
	numberOfStars: number;
	onRatingSelect: (value: number) => void;
}

const StarRatingSelect: React.FC<StarRatingSelectProps> = (props) => {
	const [selectedValue, setSelectedValue] = useState<number>(props.numberOfStars);

	useEffect(() => {
		props.onRatingSelect(selectedValue);
	}, [selectedValue]);

	function renderStars() {
		let stars: ReactNodeArray = [];
		for (let i = 0; i < props.numberOfStars; i++) {
			stars.push(
				<React.Fragment key={i}>
					<label className={'ratingLabel'} htmlFor={`rating-${i}`}>
						<div className={'star'} />
					</label>
					<input
						className={'ratingInput'}
						name={'rating'}
						id={`rating-${i}`}
						value={`${i}`}
						type="radio"
						onClick={() => {
							setSelectedValue(i + 1);
						}}
					/>
				</React.Fragment>
			);
		}
		return stars;
	}

	return (
		<div className={'rsStarRatingSelect'}>
			<Box display={'flex'} className={'ratingGroup'}>
				{renderStars()}
			</Box>
		</div>
	);
};

export default StarRatingSelect;
