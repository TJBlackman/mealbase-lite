import React, { useState, PropsWithChildren } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Collapse, Button } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';

// if not mobile, render children
// if mobile, render children inside a dropdown

interface IProps {
  isVisible: boolean;
  toggleOpen: () => void;
}

export const MobileOnlyDropdown = ({ children, isVisible, toggleOpen }: PropsWithChildren<IProps>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div>
      <Button
        onClick={toggleOpen}
        fullWidth
        size='medium'
        endIcon={isVisible ? <CloseIcon /> : <FilterListIcon />}
        style={{ justifyContent: 'flex-end', marginBottom: '8px' }}
      >
        {isVisible ? 'Hide ' : 'Show '}Filters
      </Button>
      <Collapse in={isVisible} style={{ marginTop: '10px' }}>
        {children}
      </Collapse>
    </div>
  );
};
