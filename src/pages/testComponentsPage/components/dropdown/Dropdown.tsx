import * as React from 'react';
import './Dropdown.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { useState } from 'react';

interface DropdownProps {
	title?: string;
	placeholder?: string;
	onChangeCallBack?: () => void;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
	const [toggleContent, setToggleContent] = useState<boolean>(false);
	function sendCallback() {
		if (props.onChangeCallBack) {
			props.onChangeCallBack();
		}
	}

	return (
		<div className="rsDropdown">
			<Box
				className="rsDropdownBtn"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				onClick={() => setToggleContent((prevState) => !prevState)}
			>
				<Box id="labelContainer">
					<Label variant="body2" color="#0000007C" paddingBottom={4}>
						Filter By
					</Label>
					<Label color="#000000BC" className="filterTitleLabel">
						{props.title}
					</Label>
				</Box>
				<Box id="chevronIcon" className="chevronIcon">
					<Icon iconImg={`icon-chevron-${toggleContent ? 'down' : 'up'}`} size={25} />
				</Box>
			</Box>
			{toggleContent && (
				<Box className="DropdownContent">
					{props.children}
					<Box className="dropdownFooter" borderTop="1px solid #e0e0e0">
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							height="75px"
							paddingX="10px"
						>
							<button className="clearBtn">Clear</button>
							<button className="applyBtn" onClick={sendCallback}>
								Apply
							</button>
						</Box>
					</Box>
				</Box>
			)}
		</div>
	);
};

export default Dropdown;
