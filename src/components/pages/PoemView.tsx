import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers/rootReducer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image'
import { FetchStatus } from '../../reducers/apiReducer';
import { imagePathToUrl } from '../../utils/utils';

interface ReduxStateProps {
	poem: string;
	isFetchingImage: FetchStatus,
	images: {[key: string]: string}
}

type Props = ReduxStateProps;

class PoemView extends React.Component<Props> {
	render() {
		const { poem, isFetchingImage, images } = this.props;

		return <Container>
		<Row>
		  <Col style={{"whiteSpace": "pre-wrap"}}>
			{
				isFetchingImage === 'fetching' ? <Placeholder xs={12} animation="wave"/>  : poem
			}
		  </Col>
		  <Col>
		  	{
				isFetchingImage === 'fetching' ? <Spinner animation="border" /> : (poem && images && images[poem] && <Image fluid src={imagePathToUrl(images[poem])} />)
			}
		  </Col>
		</Row>
	  </Container>
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	poem: state.main.poem,
	isFetchingImage: state.api.isFetchingImage,
	images: state.main.images,
});

export default connect(mapStateToProps)(PoemView);
