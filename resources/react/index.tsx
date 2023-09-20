import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './components/router';

export function render(root_name: string = 'root', app: React.ReactNode): void {
	const root = document.getElementById(root_name) as HTMLElement;
	if (root)
		ReactDOM.createRoot(root).render(
			<>
				<React.StrictMode>{app}</React.StrictMode>
			</>
		);
}

render('root', <Router />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
