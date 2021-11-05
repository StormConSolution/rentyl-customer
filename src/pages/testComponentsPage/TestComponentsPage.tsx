import * as React from 'react';
import { Page } from '@bit/redsky.framework.rs.996/dist';
import './TestComponentsPage.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Dropdown from './components/dropdown/Dropdown';
import Checkbox from './components/checkbox/Checkbox';
import { useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import PropertyType = Api.Destination.Res.PropertyType;

const TestComponentsPage: React.FC = () => {
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [options, setOptions] = useState<OptionType[]>([]);
	const [propertySelection, setPropertySelection] = useState<PropertyType[]>([]);

	function formatOptions(options: Api.Destination.Res.PropertyType[]) {
		return options.map((value) => {
			return { value: value.id, label: value.name };
		});
	}
	useEffect(() => {
		async function getPropertyTypes() {
			try {
				let response = await destinationService.getAllPropertyTypes();
				let newOptions = formatOptions(response);
				setOptions(newOptions);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}
		getPropertyTypes().catch(console.error);
	}, []);

	function displayAllProperties() {
		return (
			<Dropdown title="Accommodations">
				<Box padding="1rem">
					{options.map((item, idx) => (
						<Checkbox title={item.label} value={item.value} />
					))}
				</Box>
			</Dropdown>
		);
	}
	return (
		<Page className="rsTestComponentsPage">
			<Box id="container" width="100%" marginX="auto">
				<Box id="row" display="flex" flexWrap="wrap" marginX="10px" marginY="10px">
					<Box id="col" flex="1 0 0%">
						<h1>Custom Dropdown</h1>
					</Box>
				</Box>
				<Box id="row" display="flex" flexWrap="wrap" marginX="10px" marginY="10px">
					<Box id="col" flex="0 0 auto" width="8.33333%" paddingX="10px">
						<Dropdown title="Price">
							<Box padding="1rem">
								<h4>Price Slider</h4>
							</Box>
						</Dropdown>
					</Box>
					<Box id="col" flex="0 0 auto" width="16.66666%" paddingX="10px">
						<Dropdown title="Accommodations">
							<Box padding="1rem">
								<Checkbox title="Aparthotel Room" />
								<Checkbox title="Cabin" />
								<Checkbox title="Condominium" />
								<Checkbox title="Cottage" />
								<Checkbox title="House" />
								<Checkbox title="Hotel Room" />
								<Checkbox title="Hotel Suite" />
								<Checkbox title="Mansion" />
								<Checkbox title="Ranch" />
							</Box>
						</Dropdown>
					</Box>
					<Box id="col" flex="0 0 auto" width="16.66666%" paddingX="10px">
						<Dropdown title="Bedrooms">
							<Box padding="1rem">
								<h4>Bedroom / Bathroom Form</h4>
							</Box>
						</Dropdown>
					</Box>
					<Box id="col" flex="0 0 auto" width="16.66666%" paddingX="10px">
						{displayAllProperties()}
					</Box>
				</Box>
			</Box>
		</Page>
	);
};

export default TestComponentsPage;
