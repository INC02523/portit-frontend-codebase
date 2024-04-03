import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { CircularProgress, Backdrop } from "@mui/material";
import Navbar from "../layout/Navbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SimpleTable = () => {
  const [items, setItems] = useState([]);
  const [newUserItem, setNewUserItem] = useState({
    Name: "",
    Kind: "default",
    Description: "",
    User: "",
    Password: "",
    type: "User Credentials",
  });
  const [newOAuthItem, setNewOAuthItem] = useState({
    Name: "",
    Kind: "OAuth Type",
    Description: "",
    TokenServiceUrl: "",
    ClientID: "",
    ClientSecret: "",
    type: "OAuth2 Client Credentials",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [credentialType, setCredentialType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [optionVisible, setOptionVisible] = useState(false);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    //console.log("useEffect Two called");

    setProcessedData(data);
  }, [data]);

  const fetchData = async () => {
    try {
      const reqPayload = {
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
      const userCredsResponse = await axios.post(
        "http://localhost:8080/api/v1/monitoring/security/get/usercredential",
        reqPayload
      );

      // Add type property to each item
      setProcessedData(userCredsResponse?.data?.payload);
      setData(userCredsResponse?.data?.payload);
      setLoading(false);
      //console.log(items);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data!!");
    }
  };

  const resetUserForm = () => {
    setNewUserItem({
      Name: "",
      Kind: "default",
      Description: "",
      User: "",
      Password: "",
      type: "User Credentials",
    });
  };

  const resetOAuthForm = () => {
    setNewOAuthItem({
      Name: "",
      Kind: "default",
      Description: "",
      TokenServiceUrl: "",
      ClientID: "",
      ClientSecret: "",
      type: "OAuth2 Client Credentials",
    });
  };

  const handleCancel = () => {
    setOpenDialog(false);
    resetUserForm();
    resetOAuthForm();
    setEditingItem(null);
  };

  const handleAddUserItem = async () => {
    try {
      setLoading(true);
      const addUserPayload = {
        payload: {
          Name: newUserItem.Name,
          Kind: newUserItem.Kind,
          Description: newUserItem.Description,
          User: newUserItem.User,
          Password: newUserItem.Password,
        },
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
        "http://localhost:8080/api/v1/monitoring/security/create/usercredential",
        addUserPayload
      );
      setProcessedData((prevItems) => [...prevItems, response.data]);
      handleCancel();
      fetchData();
      setLoading(false);
      toast.success("Sucessfully added user credentials");
    } catch (error) {
      console.error("Error adding user item:", error);
      toast.error("Failed to add user credentials");
    }
  };

  const handleEditUserItem = async () => {
    try {
      const editUserPayload = {
        payload: {
          Kind: "default",
          Description: newUserItem.Description,
          User: newUserItem.User,
          Password: newUserItem.Password,
        },
        cpiAgent: {
          clientId: "sb-1c2750c3-19c7-45d9-9c23-069ef09ce6cc!b220021|it!b26655",
          clientSecret:
            "eebdaf78-18ca-4520-879e-79955cffc064$4ore9p7_yZMJ9SPwqT8kiv7GZrfrYpXpz5rntBKIsS4=",
          tokenUrl:
            "https://trial-aq5zrmf6.authentication.us10.hana.ondemand.com/oauth/token",
          url: "https://trial-aq5zrmf6.it-cpitrial05.cfapps.us10-001.hana.ondemand.com",
          environment: "DEV",
        },
      };
      //console.log(editUserPayload);
      const response = await axios.put(
        `http://localhost:8080/api/v1/monitoring/security/update/usercredential?query=${editingItem.Name}`,
        editUserPayload
      );
      setProcessedData((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? response.data : item
        )
      );
      handleCancel(); // Reset the form on successful edit
      fetchData();
      toast.success("Sucessfully updated user credentials");
    } catch (error) {
      console.error("Error editing user item:", error);
      toast.error("Failed to update user credentials");
    }
  };
  const handleDeleteItem = async (Name, type) => {
    try {
      setLoading(true);
      const deletePayload = {
        payload: {},
        cpiAgent: {
          clientId: "sb-1c2750c3-19c7-45d9-9c23-069ef09ce6cc!b220021|it!b26655",
          clientSecret:
            "eebdaf78-18ca-4520-879e-79955cffc064$4ore9p7_yZMJ9SPwqT8kiv7GZrfrYpXpz5rntBKIsS4=",
          tokenUrl:
            "https://trial-aq5zrmf6.authentication.us10.hana.ondemand.com/oauth/token",
          url: "https://trial-aq5zrmf6.it-cpitrial05.cfapps.us10-001.hana.ondemand.com",
          environment: "DEV",
        },
      };
      let apiUrl;
      //console.log("Inside delete", Name, type);
      if (type === "User Credentials") {
        apiUrl = `http://localhost:8080/api/v1/monitoring/security/delete/usercredential?query=${Name}`;
      } else if (type === "OAuth2 Client Credentials") {
        apiUrl = `http://localhost:8080/api/v1/monitoring/security/delete/oauthcredentials?query=${Name}`;
      } else {
        console.error("Invalid item type");
        return;
      }
      //console.log(apiUrl);
      await axios.post(apiUrl, deletePayload);
      setProcessedData((prevItems) =>
        prevItems.filter((item) => item.Name !== Name)
      );
      //console.log("deleteItems", items);
      setLoading(false);
      toast.success(`Sucessfully deleted ${type} credentials`);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`Failed to delete ${type} credentials`);
    }
  };

  const handleAddOAuthItem = async () => {
    try {
      const oAuthPayload = {
        payload: {
          Name: newOAuthItem.Name,
          Description: newOAuthItem.Description,
          TokenServiceUrl:
            "https://trial-aq5zrmf6.authentication.us10.hana.ondemand.com/oauth/token",
          ClientId: "sb-1c2750c3-19c7-45d9-9c23-069ef09ce6cc!b220021|it!b26655",
          ClientSecret:
            "eebdaf78-18ca-4520-879e-79955cffc064$4ore9p7_yZMJ9SPwqT8kiv7GZrfrYpXpz5rntBKIsS4=",
          ClientAuthentication: "body",
          ScopeContentType: "json",
        },
        cpiAgent: {
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
        "http://localhost:8080/api/v1/monitoring/security/create/oauthcredentials",
        oAuthPayload
      );
      setProcessedData((prevItems) => [...prevItems, response.data]);
      handleCancel();
      fetchData();
      toast.success("Sucessfully added OAuth credentials");
    } catch (error) {
      console.error("Error adding OAuth item:", error);
      toast.error("Failed to add OAuth credentials");
    }
  };

  const handleEditOAuthItem = async () => {
    try {
      const editedPayload = {
        payload: {
          Description: newOAuthItem.Description,
          TokenServiceUrl:
            "https://trial-aq5zrmf6.authentication.us10.hana.ondemand.com/oauth/token",
          ClientId: "sb-1c2750c3-19c7-45d9-9c23-069ef09ce6cc!b220021|it!b26655",
          ClientSecret:
            "eebdaf78-18ca-4520-879e-79955cffc064$4ore9p7_yZMJ9SPwqT8kiv7GZrfrYpXpz5rntBKIsS4=",
          ClientAuthentication: "body",
          ScopeContentType: "json",
        },
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
      const response = await axios.put(
        `http://localhost:8080/api/v1/monitoring/security/update/oauthcredentials/?query=${editingItem.Name}`,
        editedPayload
      );
      setProcessedData((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? response.data : item
        )
      );
      handleCancel();
      fetchData();
      toast.success("Sucessfully updated OAuth credentials");
    } catch (error) {
      console.error("Error editing OAuth item:", error);
      toast.error("Failed to update OAuth credentials");
    }
    setOpenDialog(false);
  };

  const handleEditClick = (item) => {
    //console.log(item);
    if (item.Type === "User Credentials") {
      setNewUserItem({
        Name: item.Name,
        Kind: item.Kind,
        Description: item.Description,
        User: item.User,
        Password: item.Password,
        type: "User Credentials",
      });
      //console.log(credentialType);
      setCredentialType("User Credentials");
    } else if (item.Type === "OAuth2 Client Credentials") {
      setNewOAuthItem({
        Name: item.Name,
        Kind: item.Kind,
        ClientID: item.ClientID,
        ClientSecret: item.ClientSecret,
        TokenServiceUrl: item.TokenServiceUrl,
        Description: item.Description,
        type: "OAuth2 Client Credentials",
      });
      setCredentialType("OAuth2 Client Credentials");
    }

    setEditingItem(item);
    setOpenDialog(true);
  };

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
            return true;
          }
        }
      }
      return false;
    });

    const sortedItems = stableSort(
      filteredItems,
      getComparator(order, orderBy)
    );
    return sortedItems;
  }, [processedData, order, orderBy, searchTerm]);

  const handleCreateButtonClick = (type) => {
    setCredentialType(type);
    setOpenDialog(true);
  };

  //paste start

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
      id: "type",
      numeric: false,
      disablePadding: false,
      label: "Type",
    },
    {
      id: "deployedBy",
      numeric: false,
      disablePadding: false,
      label: "Deployed By",
    },
    {
      id: "deployedOn",
      numeric: false,
      disablePadding: false,
      label: "Deployed On",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: "Action",
    },
  ];
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

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
              // align={"center"}
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
            // background: "rgb(157,198,255)",
            background:
              "linear-gradient(90deg, rgba(75, 149, 220,1) 10%, rgba(255,255,255,0) 99%)",
            borderRadius: "20px",
            marginTop: "20px",
            paddingLeft: "20px",
            textAlign: "center",
          }}
          variant="h2"
          fontWeight="500"
          id="tableTitle"
          component="div"
        >
          Credentials
        </Typography>
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
              <div className="flex justify-between items-center mb-16 mt-10">
                <label className="font-bold ml-5">
                  Filter:
                  <input
                    className="bg-gray-80 p-1 ml-5 w-64 rounded-md	"
                    type="text"
                    value={searchTerm}
                    onChange={handleFilterChange}
                  />
                </label>

                <div className="block   mr-5 ">
                  <button
                    className="float-right p-2  bg-blue-500 text-white w-40"
                    onClick={() => setOptionVisible(!optionVisible)}
                  >
                    Create
                  </button>

                  {optionVisible && (
                    <div className="float-right mt-5">
                      <div className="mt-4 absolute flex flex-col bg-slate-100">
                        <Button
                          className="block mb-2"
                          onClick={() =>
                            handleCreateButtonClick("User Credentials")
                          }
                        >
                          Create User Cred
                        </Button>
                        <Button
                          className="block mb-2"
                          onClick={() =>
                            handleCreateButtonClick("OAuth2 Client Credentials")
                          }
                        >
                          Create OAuth Cred
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <TableContainer>
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
                          key={row.Name}
                          hover
                          tabIndex={-1}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {row.Name}
                          </TableCell>
                          <TableCell>{row.Type}</TableCell>
                          <TableCell>{row.DeployedBy}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {formatDate(row.DeployedOn)}
                          </TableCell>
                          <TableCell>
                            <EditIcon
                              color="primary"
                              onClick={() => handleEditClick(row)}
                            />

                            <DeleteIcon
                              color="error"
                              sx={{ margin: "10px" }}
                              type="button"
                              onClick={() =>
                                handleDeleteItem(row.Name, row.Type)
                              }
                            />
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
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>
          {credentialType === "User Credentials"
            ? "Create User Credential"
            : "Create OAuth Credential"}
        </DialogTitle>
        <DialogContent className="flex flex-col">
          {credentialType === "User Credentials" ? (
            <>
              <TextField
                label="Name"
                value={newUserItem.Name}
                onChange={(e) =>
                  setNewUserItem({ ...newUserItem, Name: e.target.value })
                }
              />
              <TextField
                label="Kind"
                value={"default"}
                onChange={(e) =>
                  setNewUserItem({ ...newUserItem, Kind: e.target.value })
                }
              />
              <TextField
                label="Description"
                value={newUserItem.Description}
                onChange={(e) =>
                  setNewUserItem({
                    ...newUserItem,
                    Description: e.target.value,
                  })
                }
              />
              <TextField
                label="User"
                value={newUserItem.User}
                onChange={(e) =>
                  setNewUserItem({ ...newUserItem, User: e.target.value })
                }
              />
              <TextField
                type="password"
                label="Password"
                value={newUserItem.Password}
                onChange={(e) =>
                  setNewUserItem({
                    ...newUserItem,
                    Password: e.target.value,
                  })
                }
              />
            </>
          ) : (
            <>
              <TextField
                label="OAuth Name"
                value={newOAuthItem.Name}
                onChange={(e) =>
                  setNewOAuthItem({ ...newOAuthItem, Name: e.target.value })
                }
              />
              <TextField
                label="OAuth Type"
                value={"default"}
                onChange={(e) =>
                  setNewOAuthItem({ ...newOAuthItem, Kind: e.target.value })
                }
              />
              <TextField
                label="Client ID"
                value={newOAuthItem.ClientID}
                onChange={(e) =>
                  setNewOAuthItem({
                    ...newOAuthItem,
                    ClientID: e.target.value,
                  })
                }
              />
              <TextField
                label="Client Secret"
                value={newOAuthItem.ClientSecret}
                onChange={(e) =>
                  setNewOAuthItem({
                    ...newOAuthItem,
                    ClientSecret: e.target.value,
                  })
                }
              />
              <TextField
                label="Token Service URL"
                value={newOAuthItem.TokenServiceUrl}
                onChange={(e) =>
                  setNewOAuthItem({
                    ...newOAuthItem,
                    TokenServiceUrl: e.target.value,
                  })
                }
              />
              <TextField
                label="Description"
                value={newOAuthItem.Description}
                onChange={(e) =>
                  setNewOAuthItem({
                    ...newOAuthItem,
                    Description: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {credentialType === "User Credentials" ? (
            <>
              <Button onClick={handleCancel} color="secondary">
                Cancel
              </Button>
              {editingItem ? (
                <Button onClick={handleEditUserItem} color="primary">
                  Update
                </Button>
              ) : (
                <Button onClick={handleAddUserItem} color="primary">
                  Add
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={handleCancel} color="secondary">
                Cancel
              </Button>
              {editingItem ? (
                <Button onClick={handleEditOAuthItem} color="primary">
                  Update OAuth
                </Button>
              ) : (
                <Button onClick={handleAddOAuthItem} color="primary">
                  Add OAuth
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Navbar>
  );

  //paste end
};

export default SimpleTable;
