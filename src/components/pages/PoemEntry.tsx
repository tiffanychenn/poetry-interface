import * as React from 'react';
import Form from 'react-bootstrap/Form';

class PoemEntry extends React.Component {
	render() {
		return <Form>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Label>Example textarea</Form.Label>
					<Form.Control as="textarea" rows={3} />
				</Form.Group>
			</Form>;
	}
}


export default PoemEntry;