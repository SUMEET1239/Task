import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { fetchUsers, deleteUser } from "../features/table/tableThunk";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import * as XLSX from "xlsx";

import { toast } from "react-toastify";

import UserForm from "./UserForm";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { ArrowUpward, ArrowDownward, UnfoldMore } from "@mui/icons-material";

const DataTable = () => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.table);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?",
      );

      if (!confirmDelete) return;

      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success("User Deleted Successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    },
    [dispatch],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  const table = useReactTable({
    data: users || [],
    columns,

    state: {
      globalFilter,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // DOWNLOAD EXCEL
  const downloadExcel = () => {
    const filteredRows = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    const worksheet = XLSX.utils.json_to_sheet(filteredRows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "users.xlsx");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Search Users..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          sx={{ width: 300 }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="success" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          borderRadius: 3,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#000000",
                        color: "white",
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        transition: "0.2s",

                        "&:hover .sort-icon": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {header.column.getCanSort() && (
                          <Box
                            className="sort-icon"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              opacity: sorted ? 1 : 0.5,
                              transition: "0.2s",
                            }}
                          >
                            {sorted === "asc" ? (
                              <ArrowUpward sx={{ fontSize: 18 }} />
                            ) : sorted === "desc" ? (
                              <ArrowDownward sx={{ fontSize: 18 }} />
                            ) : (
                              <UnfoldMore sx={{ fontSize: 18 }} />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={3}>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={4}>No Users Found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography fontWeight={500}>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* USER FORM MODAL */}
      <UserForm
        open={showForm}
        handleClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        editUser={selectedUser}
      />
    </Box>
  );
};

export default DataTable;
