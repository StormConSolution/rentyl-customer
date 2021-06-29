import React from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';

const BookingFlowAddPackagePage = () => {
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	return (
		<Page>
			<Label
				onClick={() => {
					let data = params.data;
					if (data.stays) data.stays = [...data.stays, data.newRoom];
					else data.stays = [data.newRoom];
					delete data.newRoom;
					router.navigate(`/booking/checkout?data=${JSON.stringify(data)}`).catch(console.error);
				}}
			>
				Click Me!
			</Label>
		</Page>
	);
};

export default BookingFlowAddPackagePage;
