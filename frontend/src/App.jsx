import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<ToastProvider>
					<AuthProvider>
						<GlobalErrorHandler />
						<ErrorBoundary>
							<AppRoutes />
						</ErrorBoundary>
					</AuthProvider>
				</ToastProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
