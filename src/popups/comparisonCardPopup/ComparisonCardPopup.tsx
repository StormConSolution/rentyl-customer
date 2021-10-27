import * as React from 'react';
import './ComparisonCardPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Icon from '@bit/redsky.framework.rs.icon';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl } from '@bit/redsky.framework.rs.form';

export interface ComparisonCardPopupProps extends PopupProps {
	logo: string;
	title: string;
	roomTypes: OptionType[];
	updateControl: (value: any) => void;
	onClose: () => void;
	popupOnClick?: (pinToFirst: boolean) => void;
	className?: string;
	control: RsFormControl;
}

const ComparisonCardPopup: React.FC<ComparisonCardPopupProps> = (props) => {
	let pinToFirst: boolean = false;

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsComparisonCardPopup'}>
				<Icon
					iconImg={'icon-close'}
					className={'closeBtn'}
					cursorPointer
					onClick={() => {
						popupController.close(ComparisonCardPopup);
					}}
				/>
				<Paper className={'paperWrapper'} height={'423px'} width={'335px'} backgroundColor={'#fcfbf8'}>
					<img src={props.logo} alt={'resort logo'} width={'82px'} />
					<Label className={'title'} variant={'h3'}>
						{props.title}
					</Label>
					<Label className={'editTile'} variant={'h2'}>
						Edit
					</Label>
					<Box className={'accommodationSelect'} display={'flex'}>
						<Select control={props.control} options={props.roomTypes} updateControl={props.updateControl} />
					</Box>
					<div className={'radioDiv'}>
						<Label variant={'body1'}>Pin to first column?</Label>
						<div className={'yesPin'}>
							<input
								type="radio"
								id="pinToFirst"
								name="accommodationSelect"
								value="pinToFirst"
								onChange={() => (pinToFirst = true)}
							/>
							<label htmlFor="pinToFirst">Yes (will override previous pin)</label>
						</div>
						<div className={'noPin'}>
							<input
								type="radio"
								id="keepOldPin"
								name="accommodationSelect"
								value="keepOldPin"
								defaultChecked={true}
								onChange={() => {
									pinToFirst = false;
								}}
							/>
							<label htmlFor="keepOldPin">No (keep old pin)</label>
						</div>
					</div>
					<Box className={'buttonBox'} display={'flex'}>
						<LabelButton
							variant={'caption'}
							look={'containedSecondary'}
							onClick={() => popupController.close(ComparisonCardPopup)}
							label={'Cancel'}
							buttonType={'button'}
							className={'popupBtn'}
						/>
						<LabelButton
							variant={'caption'}
							look={'containedPrimary'}
							onClick={() => {
								if (props.popupOnClick) props.popupOnClick(pinToFirst);
								popupController.close(ComparisonCardPopup);
							}}
							label={'apply'}
							buttonType={'button'}
							className={'popupBtn'}
						/>
					</Box>
				</Paper>
			</div>
		</Popup>
	);
};

export default ComparisonCardPopup;
