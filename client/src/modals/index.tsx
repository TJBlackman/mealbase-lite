import React from 'react';
import { DeleteRecipeModal } from './delete-recipe.modal';
import { ComingSoonModal } from './coming-soon.modal';
import { useModalContext } from '../context/modal';

export const ModalConductor = () => {
  const { visible, content, dismissModal } = useModalContext();

  if (!visible) {
    return null;
  }

  switch (content.modalType) {
    case 'DELETE RECIPE': {
      return <DeleteRecipeModal data={content.modalData} onClose={dismissModal} />;
    }
    case 'COMING SOON': {
      return <ComingSoonModal onClose={dismissModal} />;
    }
    default: {
      console.error(`Unknown Modal Type:\n${JSON.stringify(content, null, 4)}`);
      return null;
    }
  }
};
