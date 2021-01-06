import { Router } from '@bit/redsky.framework.rs.996';

class AdvancedRouter extends Router {
	constructor() {
		super({ animate: false });
	}
}

let router = new AdvancedRouter();

export default router;
(window as any).router = router;
