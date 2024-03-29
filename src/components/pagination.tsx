import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Pagination as MuiPagination } from "@mui/material";

type Props = {
  totalCount: number;
};

export function Pagination(props: Props) {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page) || 1);

  // calculate total number of pages, given the total results and the results to show per page
  const paginationCount = Math.ceil(
    Number(props.totalCount) / Number(router.query.limit || 25)
  );

  //  on page change, update the url param and go to the new page
  useEffect(() => {
    const params = new URLSearchParams(
      router.query as unknown as Record<string, string>
    );
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    let paramStr = params.toString();
    paramStr = paramStr.length > 0 ? `?${paramStr}` : "";

    router.push(router.pathname + paramStr);
  }, [page]);

  // on url change, check that the pagination has been updated.
  useEffect(() => {
    const urlPage = router.query.page || "1";
    if (urlPage != page.toString()) {
      setPage(Number(urlPage));
    }
  }, [router.query.page]);

  return (
    <MuiPagination
      count={paginationCount}
      size="small"
      sx={{ display: "inline-block" }}
      onChange={(e, page) => setPage(page)}
      page={page}
    />
  );
}
