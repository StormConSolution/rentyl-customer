import * as React from 'react';
import './PackageDetailsPopup.scss';
import { Popup } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../../components/paper/Paper';
import DestinationPackageTile from '../../../components/destinationPackageTile/DestinationPackageTile';

export interface PackageDetailsPopupProps extends PopupProps {
	package: Api.UpsellPackage.Res.Get;
	onAdd: () => void;
}

const PackageDetailsPopup: React.FC<PackageDetailsPopupProps> = (props) => {
	return (
		<Popup opened={props.opened}>
			<Paper className={'rsPackageDetailsPopup'}>
				<DestinationPackageTile
					title={props.package.title}
					description={props.package.description}
					priceCents={0}
					imgPaths={props.package.media.map((item) => {
						return item.urls.large;
					})}
					onAddPackage={props.onAdd}
				/>
			</Paper>
		</Popup>
	);
};

export default PackageDetailsPopup;
