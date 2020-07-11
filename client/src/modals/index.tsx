import React, { useContext } from 'react';
import { AppContext } from '../context';
import { DeleteRecipeModal } from './delete-recipe.modal';
import { ComingSoonModal } from './coming-soon.modal';
import { ModalTypes } from '../types';

export const ModalConductor = () => {
  const { globalState, setModal } = useContext(AppContext);
  const { modal } = globalState;

  if (!modal.visible) {
    return null;
  }

  const closeModal = () => setModal({ type: ModalTypes.CLEAR_MODAL });

  switch (modal.type) {
    case ModalTypes.DELETE_RECIPE: {
      return <DeleteRecipeModal data={modal.data} onClose={closeModal} />;
    }
    case ModalTypes.COMING_SOON: {
      return <ComingSoonModal onClose={closeModal} />;
    }
    default: {
      console.error(`Unknown Modal Type: ${modal.type}`);
      return null;
    }
  }
};
