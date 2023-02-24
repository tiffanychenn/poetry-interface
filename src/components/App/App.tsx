import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers/rootReducer";
import PoemEntry from "../pages/PoemEntry";
import PoemView from "../pages/PoemView";
import 'bootstrap/dist/css/bootstrap.min.css';

export const DEBUG_MODE = false;

interface ReduxStateProps {
	poem: string;
}

type Props = ReduxStateProps;

class ParticipantApp extends React.Component<Props> {

	render() {
		const { poem } = this.props;
		return <div style={{position: 'relative', padding: '5vh'}}>
			{ poem 
				? <PoemView />
				: <PoemEntry />
			}
		</div>;
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	poem: state.main.poem,
});

export default connect(mapStateToProps)(ParticipantApp);
