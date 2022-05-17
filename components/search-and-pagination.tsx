import {
  Button,
  Grid,
  TextField,
  MenuItem,
  Pagination,
  Toolbar,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  totalCount: number;
  limit: number;
  skip: number;
  search: string;
};

export function SearchAndPage(props: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>(props.search);
  const [limit, setLimit] = useState(props.limit.toString());
  const [page, setPage] = useState(Number(router.query.page) || 1);

  // update page ui when url changes
  useEffect(() => {
    setPage(Number(router.query.page) || 1);
  }, [router.query]);

  // build a query parameter object so we can request new page of results
  function getUrlParams(page?: number) {
    const params = new URLSearchParams();
    if (search.length > 0) {
      params.append("search", search);
    }
    if (limit !== "25") {
      params.append("limit", limit);
    }
    if (page) {
      params.append("page", page.toString());
    }
    const paramStr = params.toString();
    if (paramStr.length < 1) {
      return "";
    }
    return `?${paramStr}`;
  }

  function updatePageUrl() {
    const params = getUrlParams();
    router.push(router.pathname + params);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updatePageUrl();
  }

  function handlePage(e: React.ChangeEvent<unknown>, page: number) {
    const params = getUrlParams(page > 1 ? page : undefined);
    router.push(router.pathname + params);
  }

  const paginationCount = Math.ceil(
    Number(props.totalCount) / Number(props.limit)
  );

  // when search is clear, go to new page without search query param
  useEffect(() => {
    console.log(search);
    if (search.length === 0 && router.query.search) {
      updatePageUrl;
    }
  }, [search, router.query.search]);

  return (
    <>
      <Toolbar disableGutters sx={{ flexWrap: "wrap" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <TextField
            size="small"
            value={search}
            variant="standard"
            label="Search"
            sx={{ width: "300px", mr: 1 }}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (() => (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "grey.500" }}
                    aria-label="Clear search input"
                    onClick={(e) => setSearch("")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ))(),
            }}
          />
          <Button type="submit" variant="outlined" color="primary">
            Search
          </Button>
        </form>
        <Grid container spacing={1} flexDirection="row-reverse" ml={1}>
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
              {[10, 25, 50, 100].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              select
              size="small"
              label="Filter"
              variant="standard"
              sx={{ width: 200 }}
            >
              {["MyLiked Recipes"].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              select
              size="small"
              label="My Collections"
              variant="standard"
              sx={{ width: 200 }}
            >
              {["Fast Recipes", "Fancy Recipes"].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Toolbar>

      <Toolbar
        disableGutters
        sx={{ justifyContent: "space-between", minHeight: "36px !important" }}
      >
        <Typography variant="body2">
          Found {props.totalCount} recipe{props.totalCount !== 1 && "s"}.
        </Typography>
        <Pagination
          count={paginationCount}
          size="small"
          sx={{ display: "inline-block" }}
          onChange={handlePage}
          page={page}
        />
      </Toolbar>
    </>
  );
}
