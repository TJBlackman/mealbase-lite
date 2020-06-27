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

export const AboutPage = () => {
  return (
    <Layout>
      <Grid container justify="center" style={{ marginTop: '20px' }}>
        <Grid item md={10}>
          <Typography variant="h3">Welcome to Mealbase</Typography>
          <Typography variant="subtitle1">
            Mealbase Lite helps it's users to organize and share their favorite
            recipes, and also empowers users to create and share weekly
            mealplans.
          </Typography>

          <Divider style={{ margin: '50px 0' }} />

          <Typography variant="h4" gutterBottom>
            Frequently Answered Questions
          </Typography>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Expansion Panel 1</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </Layout>
  );
};
