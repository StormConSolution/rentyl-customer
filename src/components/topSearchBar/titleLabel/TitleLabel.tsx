import * as React from 'react';
import './TitleLabel.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { RefObject, useEffect, useRef } from 'react';

interface TitleLabelProps {
	title: string;
	label: string;
	popoutBoxContent: React.ReactNode;
	popoutBoxPadding?: string;
	className?: string;
	titleLabelRef?: RefObject<any> | undefined;
}

const TitleLabel: React.FC<TitleLabelProps> = (props) => {
	const boxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (boxRef && boxRef.current && !boxRef.current.contains(event.target)) {
				let test = boxRef.current;
				test.style.display = 'none';
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`rsTitleLabel${props.className ? ` ${props.className}` : ''}`}
			onClick={() => {
				boxRef.current!.style.display = 'block';
			}}
			ref={props.titleLabelRef}
		>
			<Label variant={'caption3'} mb={10}>
				{props.title}
			</Label>
			<Label variant={'subtitle3'}>{props.label}</Label>
			<Box boxRef={boxRef} className={'popupBox'} padding={props.popoutBoxPadding || '40px 20px'}>
				{props.popoutBoxContent}
			</Box>
		</div>
	);
};

export default TitleLabel;
