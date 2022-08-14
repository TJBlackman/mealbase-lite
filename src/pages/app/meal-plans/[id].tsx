import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  TableContainer,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  Checkbox,
  DialogContent,
  ListItemText,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { RecipeTableRow } from '@src/components/meal-plans/recipe-table-row';
import { useRefreshServerSideProps } from '@src/hooks/refresh-serverside-props';
import { FormEvent, useState } from 'react';
import { MealPlanPermissions } from '@src/db/meal-plans';
import { Recipe, RecipeModel } from '@src/db/recipes';
import { UserModel } from '@src/db/users';
import { InvitationModel } from '@src/db/invites';
import { useMutation } from 'react-query';
import { networkRequest } from '@src/utils/network-request';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Get page data on the server before the page is rendered
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const props: Record<string, any> = { mealplan: null };
    if (context.params && context.params.id) {
      const mealplan = await MealPlansModel.findById<MealPlan>(
        context.params.id
      )
        .populate({
          path: 'owner',
          select: { email: 1 },
          model: UserModel,
        })
        .populate({
          path: 'recipes.recipe',
          model: RecipeModel,
        })
        .populate({
          path: 'members.member',
          select: 'email',
          model: UserModel,
        })
        .populate({
          path: 'invites.invitee',
          select: 'email',
          model: InvitationModel,
        })
        .lean()
        .catch((err) => {
          console.log(err);
        });
      if (mealplan) {
        props.mealplan = JSON.parse(JSON.stringify(mealplan));
      }
    }

    return { props };
  } catch (error) {
    let msg = 'An unknown error occurred.';
    if (error instanceof Error) {
      msg = error.message;
    }
    return {
      props: {
        error: msg,
      },
    };
  }
};

type Props = {
  mealplan?: MealPlan;
  error?: string;
};

export default function MealPlanDetailsPage(props: Props) {
  const refreshSSPHook = useRefreshServerSideProps({ data: props.mealplan });

  return (
    <>
      <Typography variant="h5" component="h1" paragraph color="primary">
        {props.mealplan?.title || 'Meal Plan Details'}
      </Typography>

      {!props.mealplan && (
        <Typography color="error">Error: Meal plan not found.</Typography>
      )}

      {props.mealplan && (
        <>
          <Divider />
          <TableContainer sx={{ maxWidth: '100vw' }}>
            <Table sx={{ minWidth: '500px' }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Recipes</TableCell>
                  <TableCell>Cooked</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.mealplan.recipes.map((item) => (
                  <RecipeTableRow
                    key={item.recipe._id}
                    recipe={item.recipe}
                    isCooked={item.isCooked}
                    mealplanId={props.mealplan!._id}
                    refreshSSP={refreshSSPHook.refreshSSP}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          <Typography>Members</Typography>
          <Typography variant="body2" paragraph>
            Add users to this meal plan.
          </Typography>
          <TableContainer sx={{ maxWidth: '100vw' }}>
            <Table sx={{ minWidth: '500px' }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email Address</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    Complete Recipes
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    Add/Remove Recipes
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    Add/Remove Members
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    Remove Member
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.mealplan.members.map(({ member, permissions }) => {
                  return (
                    <MemberRow
                      key={member._id}
                      member={member}
                      permissions={permissions}
                      mealplanId={props.mealplan!._id}
                      isInvitee={false}
                      refreshSSP={refreshSSPHook.refreshSSP}
                    />
                  );
                })}
                {props.mealplan.invites.map(({ invitee, permissions }) => {
                  return (
                    <MemberRow
                      key={invitee._id}
                      member={invitee}
                      permissions={permissions}
                      mealplanId={props.mealplan!._id}
                      isInvitee={true}
                      refreshSSP={refreshSSPHook.refreshSSP}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <InviteMemberForm
            mealplanId={props.mealplan!._id}
            onSuccess={refreshSSPHook.refreshSSP}
          />
        </>
      )}
    </>
  );
}

/**
 * Describes the shape of the data returned by getServerSideProps
 */
interface MealPlan {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: Recipe & { _id: string };
    isCooked: boolean;
  }[];
  members: {
    member: {
      _id: string;
      email: string;
    };
    permissions: MealPlanPermissions[];
  }[];
  invites: {
    invitee: {
      email: string;
      _id: string;
    };
    permissions: MealPlanPermissions[];
  }[];
  owner: {
    _id: string;
    email: string;
  };
}

/**
 * Invite email address to meal plan
 */
function InviteMemberForm(props: {
  mealplanId: string;
  onSuccess: () => void;
}) {
  const [emailInput, setEmailInput] = useState('');

  // mutatin to add email address to mealplan
  const mutation = useMutation(
    (email: string) =>
      networkRequest({
        url: `/api/meal-plans/${props.mealplanId}/add-member`,
        method: 'POST',
        body: {
          email,
        },
      }),
    {
      onSuccess: () => {
        setTimeout(() => {
          props.onSuccess?.();
          setEmailInput('');
          mutation.reset();
        }, 3000);
      },
    }
  );

  function addMember(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(emailInput);
  }

  return (
    <>
      <Toolbar disableGutters component="form" onSubmit={addMember}>
        <TextField
          label="Email address"
          sx={{ mr: 2, width: 250 }}
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          size="small"
          disabled={mutation.isLoading || mutation.isSuccess}
        />
        <Button
          type="submit"
          disabled={mutation.isLoading || mutation.isSuccess}
          startIcon={mutation.isLoading ? <CircularProgress size={20} /> : null}
        >
          Add Member
        </Button>
      </Toolbar>
      {mutation.isSuccess && (
        <Alert severity="success">Member successfully invited.</Alert>
      )}
      {mutation.isError && (
        <Alert severity="error">
          {(mutation.error as Error).message || 'An unknown error occurred.'}
        </Alert>
      )}
    </>
  );
}

/**
 * Render a table row for each member of the mealplan
 */
function MemberRow(props: {
  member: { email: string; _id: string };
  permissions: MealPlanPermissions[];
  mealplanId: string;
  isInvitee: boolean;
  refreshSSP: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  // mutation to request to delete this user
  const deleteMutation = useMutation(
    () =>
      networkRequest({
        url: `/api/meal-plans/${props.mealplanId}/remove-member/${props.member._id}`,
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        setShowModal(false);
        props.refreshSSP();
      },
    }
  );

  // mutation to set a user's permissions
  const editPermissionsMutation = useMutation(
    (permissions: MealPlanPermissions[]) =>
      networkRequest({
        url: `/api/meal-plans/${props.mealplanId}/edit-member/${props.member._id}`,
        method: 'PUT',
        body: {
          permissions,
        },
      }),
    {
      onSuccess: props.refreshSSP,
    }
  );

  // make the permission array a Set; easier to use
  const permissionSet = new Set(props.permissions);

  /**
   * Toggle a user's ability to mark recipes as Cooked (or completed)
   */
  function togglePermission(permission: MealPlanPermissions) {
    if (permissionSet.has(permission)) {
      editPermissionsMutation.mutate(
        props.permissions.filter((p) => p !== permission)
      );
    } else {
      editPermissionsMutation.mutate([...props.permissions, permission]);
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <ListItemText
            primary={props.member.email}
            secondary={props.isInvitee ? 'Invite Pending' : ''}
          />
        </TableCell>
        {Object.values(MealPlanPermissions).map((value) => (
          <TableCell key={value} sx={{ textAlign: 'center' }}>
            <Checkbox
              disabled={
                deleteMutation.isLoading || editPermissionsMutation.isLoading
              }
              onChange={(e) => togglePermission(value)}
              checked={permissionSet.has(value)}
            />
          </TableCell>
        ))}
        <TableCell sx={{ textAlign: 'center' }}>
          <IconButton onClick={() => setShowModal(true)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Do you want to remove the member{' '}
            <Typography
              component="code"
              sx={{ fontFamily: 'monospace', color: 'primary.main' }}
            >
              {props.member.email}
            </Typography>{' '}
            from this meal plan?
          </Typography>
          <Toolbar disableGutters>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isLoading || deleteMutation.isSuccess}
            >
              {deleteMutation.isLoading ? (
                <CircularProgress color="error" size={22} />
              ) : (
                'Remove'
              )}
            </Button>
            <Button variant="outlined" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Toolbar>
        </DialogContent>
      </Dialog>
    </>
  );
}
