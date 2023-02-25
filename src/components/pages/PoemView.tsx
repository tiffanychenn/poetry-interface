import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers/rootReducer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface ReduxStateProps {
	poem: string;
}

type Props = ReduxStateProps;

class PoemView extends React.Component<Props> {
	render() {
		const { poem } = this.props;
		return <Container>
		<Row>
		  <Col style={{"whiteSpace": "pre-wrap"}}>{poem}</Col>
		  <Col>image</Col>
		</Row>
	  </Container>
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	poem: state.main.poem,
});

export default connect(mapStateToProps)(PoemView);
