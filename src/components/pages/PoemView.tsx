import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers/rootReducer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FetchStatus } from '../../reducers/apiReducer';
import { imagePathToUrl } from '../../utils/utils';
import { ART_STYLES } from '../../utils/constants';
import { saveStyle } from '../../actions/poemActions';

interface ReduxStateProps {
	poem: string;
	style: string;
	isFetchingImage: FetchStatus,
	images: {[key: string]: string},
	saveStyle?: (style: string) => void;
}

type Props = ReduxStateProps;

class PoemView extends React.Component<Props> {
	render() {
		const { poem, isFetchingImage, images, style, saveStyle } = this.props;

		return isFetchingImage === 'fetching' ? <Spinner animation="border"/> : 
			<Container>
				<Row>
					<Col style={{"whiteSpace": "pre-wrap"}}>{poem}</Col>
					<Col>{(poem && images && images[poem] && <Image fluid src={imagePathToUrl(images[poem])} />)}</Col>
				</Row>
				<Row>
					<Col style={{"whiteSpace": "pre-wrap"}}>
						<DropdownButton id="dropdown-basic-button" title="Choose style">
							{
								ART_STYLES.map((s: string) => <Dropdown.Item active={style === s} onClick={() => {saveStyle && saveStyle(s)}}>{s}</Dropdown.Item>)
							}
						</DropdownButton>
					</Col>
				</Row>
			</Container>
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	poem: state.main.poem,
	style: state.main.style,
	isFetchingImage: state.api.isFetchingImage,
	images: state.main.images,
});

export default connect(mapStateToProps, {saveStyle})(PoemView);
