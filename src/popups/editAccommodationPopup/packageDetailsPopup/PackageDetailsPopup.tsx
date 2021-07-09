import * as React from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../../components/paper/Paper';
import DestinationPackageTile from '../../../components/destinationPackageTile/DestinationPackageTile';

export interface PackageDetailsPopupProps extends PopupProps {
	package: Api.Package.Res.Get;
	onAdd: () => void;
}

const PackageDetailsPopup: React.FC<PackageDetailsPopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsPackageDetailsPopup'}>
				<DestinationPackageTile
					title={props.package.title}
					description={props.package.description}
					priceCents={0}
					imgUrl={props.package.media[0]?.urls.large || ''}
					onAddPackage={props.onAdd}
				/>
			</Paper>
		</Popup>
	);
};

export default PackageDetailsPopup;
