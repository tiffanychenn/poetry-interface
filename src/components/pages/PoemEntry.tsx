import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { savePoem } from '../../actions/poemActions';
import { State } from '../../reducers/rootReducer';

interface ReduxDispatchProps {
	savePoem?: (poem: string) => void;
}

interface ComponentState {
	poem: string,
}

class PoemEntry extends React.Component<ReduxDispatchProps, ComponentState> {
	constructor(props: ReduxDispatchProps) {
		super(props);
		this.state = {
		  poem: ""
		};
	}

	render() {
		const {savePoem} = this.props;
		return <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {savePoem && savePoem(this.state.poem)}}>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Label>Enter poem here</Form.Label>
					<Form.Control as="textarea" rows={3} onInput={(e: React.FormEvent<HTMLInputElement>) => {this.setState({poem: e.currentTarget.value})}} />
				</Form.Group>
				<Button type="submit">Submit</Button>
			</Form>;
	}
}

const mapStateToProps = (state: State): any => ({});

export default connect(mapStateToProps, {savePoem})(PoemEntry);