import React from 'react';
import { useModalContext } from '../context/modal';
import { DeleteRecipeModal } from './recipe-delete.modal';
import { ComingSoonModal } from './coming-soon.modal';
import { AddCookbookModal } from './cookbook-new.modal';
import { EditCookbookModal } from './cookbook-edit.modal';
import { AddRecipeToCookbookModal } from './cookbook-add-recipe.modal';
import { DeleteCookbookModal } from './cookbook-delete.modal';
import { RemoveRecipeFromCookbookModal } from './cookbook-remove-recipe.modal';

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
    case 'NEW COOKBOOK': {
      return <AddCookbookModal onClose={dismissModal} />;
    }
    case 'ADD RECIPE TO COOKBOOK': {
      return <AddRecipeToCookbookModal onClose={dismissModal} data={content.modalData} />;
    }
    case 'EDIT COOKBOOK': {
      return <EditCookbookModal onClose={dismissModal} data={content.modalData} />;
    }
    case 'DELETE COOKBOOK': {
      return <DeleteCookbookModal onClose={dismissModal} data={content.modalData} />;
    }
    case 'REMOVE FROM COOKBOOK': {
      return <RemoveRecipeFromCookbookModal onClose={dismissModal} data={content.modalData} />;
    }
    default: {
      console.error(`Unknown Modal Type:\n${JSON.stringify(content, null, 4)}`);
      return null;
    }
  }
};
