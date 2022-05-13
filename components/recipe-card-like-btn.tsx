import { Button, Typography } from "@mui/material";
import { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useUserContext } from "@src/contexts/user";
import { useMutation } from "react-query";
import { networkRequest } from "@src/utils/network-request";

type Props = {
  likes: number;
  recipeId: string;
  isLiked: boolean;
  disabled?: boolean;
};

export function RecipeLikeButton(props: Props) {
  const userContext = useUserContext();
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likes, setLikes] = useState(props.likes);

  const mutation = useMutation(() =>
    networkRequest({
      url: "/api/recipes/toggle-like",
      method: "POST",
      body: {
        recipeId: props.recipeId,
      },
    })
  );

  function handleClick(e: any) {
    if (!userContext.isLoggedIn || props.disabled) {
      return;
    }
    mutation.mutate(undefined, {
      onSuccess: () => {
        if (isLiked) {
          setIsLiked(false);
          setLikes(likes - 1);
        } else {
          setIsLiked(true);
          setLikes(likes + 1);
        }
      },
    });
  }

  return (
    <Button onClick={handleClick} type="button" disabled={mutation.isLoading}>
      <Typography variant="body1" component="span" sx={{ mr: "2px" }}>
        {likes}
      </Typography>
      {isLiked ? (
        <FavoriteIcon sx={{ fontSize: "18px" }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: "18px" }} />
      )}
    </Button>
  );
}
