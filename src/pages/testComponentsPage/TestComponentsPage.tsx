import * as React from 'react';
import { Page } from '@bit/redsky.framework.rs.996/dist';
import './TestComponentsPage.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Dropdown from './components/dropdown/Dropdown';
import Checkbox from './components/checkbox/Checkbox';
import { ChangeEvent, ReactText, useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import PropertyType = Api.Destination.Res.PropertyType;

const TestComponentsPage: React.FC = () => {
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [options, setOptions] = useState<OptionType[]>([]);
	const [accommodationOptions, setAccommodationOptions] = useState<PropertyType[]>([]);

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

	function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
		const selectedIds = { id: parseInt(event.target.value), name: event.target.name };
		const newIds = [...accommodationOptions];
		newIds.push(selectedIds);
		setAccommodationOptions(newIds);
	}

	function foobar() {
		console.log(accommodationOptions);
	}

	function displayAllProperties() {
		return (
			<Dropdown title="Accommodations" onChangeCallBack={foobar}>
				<Box padding="12px">
					{options.map((item, idx) => (
						<div id="accommodationCheckboxSelection" key={idx}>
							<Checkbox
								title={item.label}
								value={item.value}
								id={`accommodation-${idx}`}
								onChange={(event) => handleOnChange(event)}
								name={item.label as string}
							/>
						</div>
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
						{displayAllProperties()}
					</Box>
				</Box>
			</Box>
		</Page>
	);
};

export default TestComponentsPage;
