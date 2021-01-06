import React from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

function NotFoundPage(): JSX.Element {
	return (
		<Page className="rsNotFoundPage">
			<Label>Page Not Found</Label>
		</Page>
	);
}

export default NotFoundPage;
