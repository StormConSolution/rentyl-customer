import * as React from 'react';
import './ViewHeader.scss';
import Box from '../box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Chip from '@bit/redsky.framework.rs.chip';
import Button from '@bit/redsky.framework.rs.button';

interface ViewHeaderProps {
	title?: string;
	name: string;
	planType?: string;
	edit?: boolean;
	onSave?: () => void;
}

const ViewHeader: React.FC<ViewHeaderProps> = (props) => {
	return (
		<Box className={'rsViewHeader'} display={'flex'} alignItems={'center'}>
			<Box>
				<Label variant={'caption'}>{props.title}</Label>
				<Label variant={'h4'}>
					{props.name} {!!props.planType && <Chip label={props.planType} look={'standard'} disabled />}
				</Label>
			</Box>
			{!props.edit ? (
				<Button look={'containedPrimary'}>
					<Label variant={'button'}>Edit</Label>
				</Button>
			) : (
				<Box display={'flex'} alignItems={'center'} marginLeft={'auto'}>
					<Button look={'none'}>
						<Label variant={'button'}>Cancel</Label>
					</Button>
					<Button className={'saveChangesBtn'} look={'containedPrimary'} onClick={props.onSave}>
						<Label variant={'button'}>Save Changes</Label>
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default ViewHeader;
