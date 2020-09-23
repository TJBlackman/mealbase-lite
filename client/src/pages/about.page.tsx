import React from 'react';
import Layout from '../layouts/app-layout';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Divider,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const QandA = [
  {
    q: 'What is MealBase?',
    a:
      "MealBase is a web app that helps it's users save, organize, and search for their favorite recipes from anywhere online!",
  },
  {
    q: 'Does MealBase sell user information?',
    a: "No! We've never done that and we don't plan to!",
  },
];

export const AboutPage = () => {
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item md={10}>
          <Typography variant='h3'>Welcome to Mealbase</Typography>
          <Typography variant='subtitle1'>
            Mealbase Lite helps it's users to organize and share their favorite recipes, and also empowers users to
            create and share weekly mealplans.
          </Typography>

          <Divider style={{ margin: '50px 0' }} />

          <Typography variant='h4' gutterBottom>
            Frequently Answered Questions
          </Typography>
          {QandA.map(({ q, a }, i) => (
            <ExpansionPanel key={i}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id={`panel-${i}`}>
                <Typography>{q}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{a}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};
