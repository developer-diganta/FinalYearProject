import { render, screen, cleanup } from '@testing-library/react';
import { Sidebaruniversity } from '../Sidebar';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';

describe('With React Testing Library', () => {
    const initialState = { 
        openClose: true
     };
    const mockStore = configureStore();
    let store;
    test('should render courseCard component', () => {
        store = mockStore(initialState);
        const { getByTestId } = render(
            <Provider store={store}>
                <BrowserRouter>
                <Sidebaruniversity />
                </BrowserRouter>
            </Provider>
        );
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    })
})