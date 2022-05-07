import { Button, Grid, TextField, MenuItem, Pagination } from "@mui/material";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

type Props = {
  totalCount: number;
  limit: number;
  skip: number;
  search: string;
};

export function SearchAndPage(props: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(props.search);
  const [limit, setLimit] = useState(props.limit.toString());

  console.log(router);

  function getUrlParams(page?: number) {
    const params = new URLSearchParams();
    if (search.length > 0) {
      params.append("search", search);
    }
    if (limit !== "25") {
      params.append("limit", limit);
    }
    if (page) {
      params.append("page", page);
    }
    const paramStr = params.toString();
    if (paramStr.length < 1) {
      return "";
    }
    return `?${paramStr}`;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = getUrlParams();
    router.push(router.pathname + params);
  }

  function handlePage(e: React.ChangeEvent<unknown>, page: number) {
    const params = getUrlParams(page > 1 ? page : undefined);
    router.push(router.pathname + params);
  }

  const paginationCount = Math.ceil(
    Number(props.totalCount) / Number(props.limit)
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4} alignItems="flex-end">
        <Grid item>
          <TextField
            size="small"
            value={search}
            variant="standard"
            label="Search"
            sx={{ width: "300px" }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
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
            {[1, 10, 25, 50, 100].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item textAlign="right">
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Grid>
        <Grid item flexGrow={1} textAlign="right">
          <Pagination
            count={paginationCount}
            size="small"
            sx={{ display: "inline-block" }}
            onChange={handlePage}
          />
        </Grid>
      </Grid>
    </form>
  );
}
