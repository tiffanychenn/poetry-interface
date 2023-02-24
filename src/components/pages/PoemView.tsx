import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers/rootReducer';

interface ReduxStateProps {
	poem: string;
}

type Props = ReduxStateProps;

class PoemView extends React.Component<Props> {
	render() {
		const { poem } = this.props;
		return <div>
			{poem}
		</div>
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	poem: state.main.poem,
});

export default connect(mapStateToProps)(PoemView);
