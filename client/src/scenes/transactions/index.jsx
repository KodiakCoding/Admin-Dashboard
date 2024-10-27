import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Transactions = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sort, setSort] = useState({});
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    
    const { data, isLoading } = useGetTransactionsQuery({
      page,
      pageSize,
      sort: JSON.stringify(sort),
      search,
    });
  
    const columns = [
      {
        field: "_id",
        headerName: "ID",
        flex: 1,
      },
      {
        field: "userId",
        headerName: "User ID",
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "CreatedAt",
        flex: 1,
      },
      {
        field: "products",
        headerName: "# of Products",
        flex: 0.5,
        sortable: false,
        renderCell: (params) => params.value.length,
      },
      {
        field: "cost",
        headerName: "Cost",
        flex: 1,
        renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
      },
    ];
  
    // Add this console.log to debug pagination
    console.log({
      page,
      pageSize,
      totalRows: data?.total,
      currentRows: data?.transactions?.length,
      isLoading
    });
  
    return (
      <Box className="m-6">
        <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
        <Box className="h-[80vh]">
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
            rowCount={(data && data.total) || 0}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            pageSizeOptions={[20, 50, 100]}
            pagination
            paginationMode="server"
            paginationModel={{
              page,
              pageSize,
            }}
            onPaginationModelChange={(newModel) => {
              setPage(newModel.page);
              setPageSize(newModel.pageSize);
            }}
            sortingMode="server"
            onSortModelChange={(newSortModel) => {
              const newSort = newSortModel?.[0] || {};
              setSort(newSort);
            }}
            slots={{
              toolbar: DataGridCustomToolbar,
            }}
            slotProps={{
              toolbar: {
                searchInput,
                setSearchInput,
                setSearch,
              },
            }}
            className="border-none"
          />
        </Box>
      </Box>
    );
  };
  
  export default Transactions;