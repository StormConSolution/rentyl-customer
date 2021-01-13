import React from 'react';
import { shallow } from 'enzyme';
import AppBar from './AppBar';
require('../../setupTests');

describe('Input component', () => {
	it('should render the component without crashing', function () {
		const wrapper = shallow(<AppBar />);
		expect(wrapper.find('.rsAppBar').exists()).toEqual(true);
	});
});
