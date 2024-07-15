import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import farmer from "../../assets/images/farmer.png";
import farm from "../../assets/images/farm.png";
import crop from "../../assets/images/crop.png";
import LoadingSpinner from "./LoadingSpinner";

function Dashboard() {
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isLgDevices = useMediaQuery("(min-width: 1024px)");
  const isMdDevices = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );
  const isXsDevices = useMediaQuery("(max-width: 767px)");
  const isSmallDevices = useMediaQuery("(max-width: 425px)");
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [districtValue, setDistrictValue] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      verifyToken(accessToken);
    }else{
      navigate("/");
    }
  }, []);

  const verifyToken = async (accessToken) => {
       try {
            const response = await fetch("https:limspakistan.org/api/verify-token/", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
      
            if (!response.ok) {
                navigate("/");
        
                throw new Error("Token verification failed");
            }
      
            // Navigate to dashboard upon valid token
        } catch (error) {
              navigate("/");
            console.error("Token verification error:", error.message);
            // Clear tokens and stay on login page
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("accessHash");
          }
       
  };

  useEffect(() => {
    const fetCountsOrganizationWise = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
              const response = await fetch(
                "https://limspakistan.org/api/organization/farmers/count/",
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              );
              const data = await response.json();
              setOrganizations(data);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error fetching organization data:", error);
            setIsLoading(false);
          }
      };
      fetCountsOrganizationWise();
  }, []);

  useEffect(() => {
    const fetchCountsDistricts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken){
        const response = await fetch(
          "https://limspakistan.org/api/organization/districtwise/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const data = await response.json();
        console.log("Districts data:", data);  // Debug log
        setDistricts(data);
        }
      } catch (error) {
        console.error("Error fetching Districts:", error);
      }
    };

    fetchCountsDistricts();
  }, []);

  const handleChangeDistrict = (event) => {
    const selectedDistrict = event.target.value;
    setDistrictValue(selectedDistrict);
    const selectedData = districts.find(
      (district) => district.name === selectedDistrict
    );
    setSelectedDistrictData(selectedData);
  };

   // Render LoadingSpinner component while loading
   if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box m="20px">
      <Box style={{display:"flex", justifyContent:"center", margin:"30px"}} >
        {/* <Header title="PD DASHBOARD" subtitle="Welcome to your dashboard" /> */}
        <h1>PD DASHBOARD</h1>
        {/* <h3>Welcome to your dashboard</h3> */}
      </Box>


      {/* Organizations Grid */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isLgDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
                ? "repeat(6, 1fr)"
                : "repeat(1, 1fr)"
        }
        gridAutoRows="auto"
        gap="20px"
      >
        {organizations.map((org) => (
          <Box
            key={org.id}
            gridColumn={
              isLgDevices
                ? "span 4"
                : isMdDevices
                  ? "span 3"
                  : isXsDevices
                    ? "span 12"
                    : "span 12"
            }
            bgcolor="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p="20px"
            borderRadius="8px"
            boxShadow={1}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="black"
              fontSize={isSmallDevices ? "20px" : "24px"}
              textAlign="center"
              mb="10px"
            >
              {org.organization}
            </Typography>
            <Box display="flex" alignItems="center" mb="10px">
              <img
                src={farmer}
                alt="Farmer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <Typography
                variant="body1"
                fontWeight="bold"
                color="black"
                fontSize={isSmallDevices ? "16px" : "20px"}
              >
                Farmers: {org.farmers_count}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb="10px">
              <img
                src={farm}
                alt="Farm"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <Typography
                variant="body1"
                color="black"
                fontSize={isSmallDevices ? "16px" : "20px"}
              >
                Farms: {org.farms_count}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <img
                src={crop}
                alt="Crop"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <Typography
                variant="body1"
                color="black"
                fontSize={isSmallDevices ? "16px" : "20px"}
              >
                Crops: {org.crops_count}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* District Dropdown */}
      <Box
        gridColumn="span 12"
        p="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          variant="h6"
          sx={{
            color: "black",
            mr: 4,
            fontSize: isSmallDevices ? "20px" : "30px",
          }}
        >
          Select District
        </Typography>
        <FormControl
          sx={{
            width: "400px",
          }}
        >
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              color: "black",
              "&.Mui-focused": {
                color: "black",
              },
            }}
          >
            Select District
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={districtValue}
            label="Select District"
            onChange={handleChangeDistrict}
            sx={{
              color: "black",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
              ".MuiSvgIcon-root": {
                color: "black",
              },
            }}
          >
            {districts.map((district) => ( 
              <MenuItem key={district.name} value={district.name} >
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {selectedDistrictData && (
        <Box gridColumn="span 12" p="20px">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, backgroundColor: "white", border: "1px solid black", borderCollapse: "collapse" }}>
              <TableHead >
                <TableRow>
                  <TableCell sx={{ color: "black", borderBottom: "1px solid black", fontWeight: "bold" }}>District Name</TableCell>
                  <TableCell sx={{ color: "black", borderBottom: "1px solid black", fontWeight: "bold" }}>Farmers Count</TableCell>
                  <TableCell sx={{ color: "black", borderBottom: "1px solid black", fontWeight: "bold" }}>Farms Count</TableCell>
                  <TableCell sx={{ color: "black", borderBottom: "1px solid black", fontWeight: "bold" }}>Crops Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDistrictData.data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "black", borderBottom: "1px solid black", borderRight: "1px solid black", padding: "8px",fontWeight:"bold" }}>{item.district_name}</TableCell>
                    <TableCell sx={{ color: "black", borderBottom: "1px solid black", borderRight: "1px solid black", padding: "8px" }}>{item.farmers_count}</TableCell>
                    <TableCell sx={{ color: "black", borderBottom: "1px solid black", borderRight: "1px solid black", padding: "8px" }}>{item.farms_count}</TableCell>
                    <TableCell sx={{ color: "black", borderBottom: "1px solid black", padding: "8px" }}>{item.crops_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
