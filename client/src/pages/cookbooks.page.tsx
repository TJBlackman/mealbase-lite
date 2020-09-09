import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Button, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useModalContext } from '../context/modal';
import { useCookbookContext } from '../context/cookbooks';
import { CookbookListItem } from '../components/cookbook-list-item';

export const CookbooksPage = () => {
  const { showModal } = useModalContext();
  const { cookbooks } = useCookbookContext();
  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Cookbooks
      </Typography>
      <Typography variant='h6'>
        Cookbooks allow users to easily organize recipes they like! You might create a cookbook full of breakfast or
        dinner recipes, a separate cookbook for cocktail recipes, or cookbook for only deserts. Cookbooks help users
        arrange the recipes they like into groups that make sense to them!
      </Typography>
      <Button
        style={{ margin: '10px 0 0 auto', display: 'flex' }}
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={() =>
          showModal({
            modalType: 'NEW COOKBOOK',
          })
        }
      >
        Add New Cookbook
      </Button>
      <Divider style={{ margin: '30px 0' }} />
      {cookbooks.map((cb) => (
        <CookbookListItem key={cb._id} cookbook={cb} />
      ))}
    </Layout>
  );
};
