import React, { useReducer } from 'react';
import { IRecipe } from '../types';

interface ILocalState {
  title: string;
  recipes: IRecipe[];
  success: string;
  error: string;
  loading: boolean;
}

const defaultState: ILocalState = {
  title: '',
  recipes: [],
  success: '',
  error: '',
  loading: false,
};

type Action =
  | { type: 'SET TITLE'; payload: string }
  | { type: 'ADD RECIPES'; payload: IRecipe[] }
  | { type: 'REMOVE RECIPES'; payload: IRecipe[] }
  | { type: 'SET SUCCESS'; payload: string }
  | { type: 'SET ERROR'; payload: string }
  | { type: 'SUBMIT FORM' }
  | { type: 'RESET FORM' };

const reducer = (state: ILocalState, action: Action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'SET TITLE': {
      state.title = action.payload;
      return;
    }
    default: {
      console.error(`Unknown action:\n${JSON.stringify(action, null, 2)}`);
    }
  }
};

export const MealPlanForm = () => {
  return <form></form>;
};
