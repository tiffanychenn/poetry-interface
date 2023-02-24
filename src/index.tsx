import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App/App';
import { store } from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';

// Source: https://stackoverflow.com/a/901144
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop as any),
});

ReactDOM.render(
	<Provider store={store}>
		<App></App>
	</Provider>,
	document.getElementById("root")
);
