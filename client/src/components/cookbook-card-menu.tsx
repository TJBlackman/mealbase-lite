import React from 'react';
import { ICookbookRecord } from '../types';
import { Menu, MenuItem, ListItemIcon, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useModalContext } from '../context/modal';

interface IProps {
  cookbook: ICookbookRecord;
  anchor: Element;
  onClose: () => void;
}

export const CookbookCardMenu = ({ cookbook, anchor, onClose }: IProps) => {
  const { showModal } = useModalContext();

  const deleteModal = () => {
    showModal({
      modalType: 'DELETE COOKBOOK',
      modalData: cookbook,
    });
    onClose();
  };

  const editModal = () => {
    showModal({
      modalType: 'EDIT COOKBOOK',
      modalData: cookbook,
    });
    onClose();
  };

  return (
    <Menu anchorEl={anchor} keepMounted open={true} onClose={onClose}>
      <MenuItem onClick={editModal}>
        <ListItemIcon>
          <EditIcon fontSize='small' />
        </ListItemIcon>
        <Typography variant='inherit' noWrap>
          Edit Cookbook
        </Typography>
      </MenuItem>
      <MenuItem onClick={deleteModal}>
        <ListItemIcon>
          <DeleteIcon fontSize='small' />
        </ListItemIcon>
        <Typography variant='inherit' noWrap>
          Delete Cookbook
        </Typography>
      </MenuItem>
    </Menu>
  );
};
