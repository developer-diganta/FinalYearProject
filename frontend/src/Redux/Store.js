import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Counter';

export default configureStore({
    reducer: {
        counter: counterReducer
    },
});