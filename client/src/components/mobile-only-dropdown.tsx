import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// if not mobile, render children
// if mobile, render children inside a dropdown

export const MobileOnlyDropdown = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Accordion className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='recipe-filters'>
        <Typography className={classes.heading}>Filters</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

// styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));
