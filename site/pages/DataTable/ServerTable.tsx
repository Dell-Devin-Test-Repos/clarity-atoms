import { css } from '@emotion/css';
import { useMemo, useState } from 'preact/hooks';

import { DataTableColumn } from '../../../src/Table/DataTable';
import { DataTable } from '../../../src/Table/DataTable';
import { Pagination } from '../../../src/Pagination/Pagination';
import { paginate } from '../../../src/Pagination/usePagination';
import { RowKey } from '../../../src/Table/useSelection';

import { makeServers, Server } from './servers';


const statusStyle = css`
  font-weight: 500;
`;

const summaryStyle = css`
  margin: 0.5rem 0 0;

  color: var(--ca-text-secondary);
  font-size: 0.875rem;
`;

const servers = makeServers(240);

const columns: DataTableColumn<Server>[] = [
  { id: 'name', header: 'Host name', value: (x) => x.name, sortable: true },
  { id: 'site', header: 'Site', value: (x) => x.site, sortable: true },
  { id: 'role', header: 'Role', value: (x) => x.role, sortable: true },
  {
    id: 'cpu', header: 'CPU %', value: (x) => x.cpu, sortable: true, align: 'right',
    render: (x) => `${x.cpu.toFixed(1)} %`
  },
  {
    id: 'status', header: 'Status', value: (x) => x.status, sortable: true,
    render: (x) => <span class={statusStyle}>{x.status}</span>
  }
];


export function ServerTable() {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<RowKey[]>([]);

  const rows = useMemo(() => paginate(servers, page, pageSize), [page, pageSize]);

  return (
    <div>
      <DataTable columns={columns} rows={rows} rowKey={(x) => x.id}
        caption='Managed servers' multiSort selectionMode='multi'
        selected={selected} onSelectionChange={setSelected}
        defaultSort={[{ id: 'name', direction: 'asc' }]} striped />

      <Pagination page={page} pageSize={pageSize} total={servers.length}
        pageSizeOptions={[10, 25, 50]}
        onPageChange={setPage}
        onPageSizeChange={(x) => { setPageSize(x); setPage(1); }} />

      <p class={summaryStyle}>{selected.length} server(s) selected.</p>
    </div>
  );
}
