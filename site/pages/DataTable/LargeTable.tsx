import { useMemo } from 'preact/hooks';

import { DataTable, DataTableColumn } from '../../../src/Table/DataTable';

import { makeServers, Server } from './servers';


const columns: DataTableColumn<Server>[] = [
  { id: 'id', header: '#', value: (x) => x.id, sortable: true, width: '5rem' },
  { id: 'name', header: 'Host name', value: (x) => x.name, sortable: true },
  { id: 'site', header: 'Site', value: (x) => x.site, sortable: true },
  { id: 'cpu', header: 'CPU %', value: (x) => x.cpu, sortable: true, align: 'right' },
  { id: 'status', header: 'Status', value: (x) => x.status, sortable: true }
];


export function LargeTable() {

  const rows = useMemo(() => makeServers(10000), []);

  return (
    <DataTable columns={columns} rows={rows} rowKey={(x) => x.id}
      caption='10,000 servers, virtualized' stickyHeader striped
      virtualized rowHeight={36} height='24rem' />
  );
}
