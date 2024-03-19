import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "axios";
import { visuallyHidden } from "@mui/utils";
import { PieChart } from "@mui/x-charts/PieChart";
import Navbar from "./layout/Navbar";

export default function Keystore() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  useEffect(() => {
    getData();
    //console.log("useEffect One called");
  }, []);

  useEffect(() => {
    //console.log("useEffect Two called");
    const updatedTestData = data.map((item) => ({
      ...item,
      validity: getValidityStatus(item.ValidNotAfter),
    }));
    setProcessedData(updatedTestData);
    //console.log("validity");
    //console.log(updatedTestData);
  }, [data]);

  async function getData() {
    try {
      const postData = {
        payload: {},
        cpiAgent: {
          name: "INCISAPI",
          clientId: "sb-1c2750c3-19c7-45d9-9c23-069ef09ce6cc!b220021|it!b26655",
          clientSecret:
            "eebdaf78-18ca-4520-879e-79955cffc064$4ore9p7_yZMJ9SPwqT8kiv7GZrfrYpXpz5rntBKIsS4=",
          tokenUrl:
            "https://trial-aq5zrmf6.authentication.us10.hana.ondemand.com/oauth/token",
          url: "https://trial-aq5zrmf6.it-cpitrial05.cfapps.us10-001.hana.ondemand.com",
          environment: "DEV",
        },
      };
      const response = await axios.post(
        "http://localhost:8080/api/v1/monitoring/get/certificate/details",
        postData
      );
      //console.log(response);

      setData(response.data.payload || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAndSortedItems = React.useMemo(() => {
    const filteredItems = processedData.filter((item) => {
      // Convert each property value to lowercase for case-insensitive comparison
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return true; // Return true if any column contains the search term
          }
        }
      }
      return false; // Return false if no column contains the search term
    });

    const sortedItems = stableSort(
      filteredItems,
      getComparator(order, orderBy)
    );
    return sortedItems;
  }, [processedData, order, orderBy, searchTerm]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const getValidityStatus = (expirationDate) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const expirationDateObj = new Date(expirationDate);
    const daysUntilExpiration = Math.floor(
      (expirationDateObj - new Date(currentDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration <= 0) {
      return "Expired";
    } else if (daysUntilExpiration <= 7) {
      return "Expiring";
    } else {
      return "Active";
    }
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "signature",
      numeric: false,
      disablePadding: false,
      label: "Signature",
    },
    {
      id: "modifiedBy",
      numeric: false,
      disablePadding: false,
      label: "Modified By",
    },
    {
      id: "modifiedAt",
      numeric: false,
      disablePadding: false,
      label: "Modified At",
    },
    {
      id: "created",
      numeric: false,
      disablePadding: false,
      label: "Created",
    },
    {
      id: "expired",
      numeric: false,
      disablePadding: false,
      label: "Expired",
    },
    {
      id: "validity",
      numeric: false,
      disablePadding: false,
      label: "Validity",
    },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              sx={{ textAlign: "center" }}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography
          sx={{
            color: "white",
            flex: "1 1 100%",
            alignSelf: "center",
            background: "rgb(83, 151, 245)",
            background:
              "linear-gradient(90deg, rgba(75, 149, 220,1) 10%, rgba(255,255,255,0) 99%)",
            borderRadius: "20px",

            paddingLeft: "20px",
          }}
          variant="h2"
          fontWeight="500"
          id="tableTitle"
          component="div"
        >
          Keystore
        </Typography>
        <PieChart series={chartData} width={400} height={180} />
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const visibleRows = React.useMemo(
    () =>
      filteredAndSortedItems.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredAndSortedItems, page, rowsPerPage]
  );

  const getValidityColor = (validity) => {
    switch (validity) {
      case "Active":
        return "green";
      case "Expiring":
        return "#e0b722";
      case "Expired":
        return "red";
      default:
        return "inherit";
    }
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    //console.log(data);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const expiredCount = processedData.filter(
    (item) => item.validity === "Expired"
  ).length;
  const expiringCount = processedData.filter(
    (item) => item.validity === "Expiring"
  ).length;
  const activeCount = processedData.filter(
    (item) => item.validity === "Active"
  ).length;
  const totalCount = processedData.length;

  const chartData = [
    {
      data: [
        { id: 0, value: activeCount, label: "Active", color: "green" },
        { id: 1, value: expiringCount, label: "Expiring", color: "#e0b722" },
        { id: 2, value: expiredCount, label: "Expired", color: "red" },
      ],
      highlightScope: { faded: "global", highlighted: "item" },
      faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
      innerRadius: 30,
      outerRadius: 80,
      paddingAngle: 3,
      cornerRadius: 5,
      startAngle: -180,
      endAngle: 180,
      cx: 150,
      cy: 100,
    },
  ];
  return (
    <Navbar>
      <Box sx={{ width: "90%", margin: "0 auto", marginTop: "2rem" }}>
        <Paper
          sx={{
            width: "auto",
            mb: 2,
            boxShadow: " 4px 3px 25px 0px rgba(191,191,191,1)",
            borderRadius: "20px",
          }}
        >
          <EnhancedTableToolbar numSelected={selected.length} />
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <Backdrop
                open={loading}
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
              >
                <CircularProgress size="3rem" />
              </Backdrop>
            </Box>
          ) : (
            <>
              <TableContainer>
                <div className="">
                  <label className="font-bold ml-5">
                    Filter:
                    <input
                      className="bg-gray-80 p-1 ml-5 w-64 mt-5 rounded-md	"
                      type="text"
                      value={searchTerm}
                      onChange={handleFilterChange}
                    />
                  </label>
                </div>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={data.length}
                  />
                  <TableBody>
                    {visibleRows.map((row) => {
                      return (
                        <TableRow
                          key={row.Alias}
                          hover
                          tabIndex={-1}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {row.Alias}
                          </TableCell>
                          <TableCell>{row.SignatureAlgorithm}</TableCell>
                          <TableCell>{row.LastModifiedBy}</TableCell>
                          <TableCell>
                            {formatDate(row.LastModifiedTime)}
                          </TableCell>
                          <TableCell>
                            {formatDate(row.validNotBefore)}
                          </TableCell>
                          <TableCell>{formatDate(row.ValidNotAfter)}</TableCell>
                          <TableCell>
                            <Box sx={{ color: getValidityColor(row.validity) }}>
                              {row.validity}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </Navbar>
  );
}
