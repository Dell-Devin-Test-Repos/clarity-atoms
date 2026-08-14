import { useState } from 'preact/hooks';

import { Pagination } from '../../../src/Pagination/Pagination';


export function PaginationExample() {

  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(25);

  return (
    <Pagination page={page} pageSize={pageSize} total={1042}
      pageSizeOptions={[10, 25, 50, 100]}
      onPageChange={setPage}
      onPageSizeChange={(x) => { setPageSize(x); setPage(1); }} />
  );
}
