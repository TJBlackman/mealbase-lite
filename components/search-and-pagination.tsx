import {
  Button,
  Collapse,
  TextField,
  MenuItem,
  Toolbar,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Pagination } from "@src/components/pagination";
import { useUserContext } from "@src/contexts/user";

type Props = {
  totalCount: number;
};

export function SearchAndPage(props: Props) {
  const userContext = useUserContext();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState<string>(
    (router.query.search as string) || ""
  );
  const [limit, setLimit] = useState(
    (router.query.limit as string)?.toString() || "25"
  );
  const [page, setPage] = useState(Number(router.query.page) || 1);
  const [liked, setLiked] = useState(
    router.query?.likedRecipes === "1" ? true : false
  );

  // build a query parameter object so we can request new page of results
  function getUrlParams() {
    const params = new URLSearchParams();
    if (search.length > 0) {
      params.append("search", search);
    }
    if (limit !== "25") {
      params.append("limit", limit);
    }
    if (page !== 1) {
      params.append("page", page.toString());
    }
    if (liked) {
      params.append("likedRecipes", "1");
    }
    const paramStr = params.toString();
    return paramStr.length > 0 ? `?${paramStr}` : "";
  }

  // update the page URL according to state - call this to get new results
  function updatePageUrl() {
    const params = getUrlParams();
    router.push(router.pathname + params);
  }

  // when the search input is submitted, just change to page one
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (page > 1) {
      setPage(1);
    } else {
      updatePageUrl();
    }
  }

  // when search is cleared, go to new page without search query param
  useEffect(() => {
    if (search.length === 0 && router.query.search) {
      updatePageUrl();
    }
  }, [search, router.query.search]);

  // clear search input
  function clearInput() {
    setSearch("");
  }

  // if search was used, and then cleared, refetch recipes with no search phrase
  useEffect(() => {
    if (router.query.search && search.length < 1) {
      updatePageUrl();
    }
  }, [router.query, search]);

  // update page url and results when these things change
  useEffect(updatePageUrl, [page, limit, liked]);

  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          alignItems: "flex-end",
          marginBottom: 1,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <TextField
            size="small"
            value={search}
            variant="standard"
            label="Search"
            sx={{ width: { xs: "65vw", sm: "300px" }, mr: 1 }}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (() => {
                if (search.length < 1) {
                  return null;
                }
                return (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "grey.500" }}
                      aria-label="Clear search input"
                      onClick={clearInput}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                );
              })(),
            }}
          />
          <Button type="submit" variant="outlined" color="primary">
            Search
          </Button>
        </form>
        <Button
          onClick={(e) => setShowFilters(!showFilters)}
          startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          variant={showFilters ? "contained" : "text"}
          sx={{
            width: { xs: "100%", sm: "unset" },
            marginTop: { xs: 1, sm: 0 },
            color: showFilters ? "common.paper" : "grey.500",
          }}
        >
          Filters
        </Button>
      </Toolbar>
      <Collapse in={showFilters} sx={{ overflow: "hidden" }}>
        <Grid
          container
          flexDirection="row-reverse"
          columnSpacing={4}
          rowSpacing={2}
          sx={{
            backgroundColor: `grey.100`,
            borderRadius: "5px",
          }}
          p={1}
        >
          <Grid item>
            <TextField
              select
              size="small"
              value={limit}
              label="Results"
              variant="standard"
              sx={{ width: 80 }}
              onChange={(e) => setLimit(e.target.value)}
            >
              {["10", "25", "50", "100"].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {userContext.isLoggedIn && (
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={liked}
                    onChange={(e) => setLiked(e.target.checked)}
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                  />
                }
                label="Liked Recipes"
              />
            </Grid>
          )}
        </Grid>
      </Collapse>
      <Toolbar
        disableGutters
        sx={{
          alignItems: "flex-end",
          justifyContent: "space-between",
          minHeight: "36px !important",
        }}
      >
        <Typography variant="body2">
          Found {props.totalCount} recipe{props.totalCount !== 1 && "s"}.
        </Typography>
        <Pagination totalCount={props.totalCount} />
      </Toolbar>
    </>
  );
}
