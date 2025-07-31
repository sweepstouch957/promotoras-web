import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface ShiftFiltersProps {
  availableCount: number;
}

const ShiftFilters = ({ availableCount }: ShiftFiltersProps) => {
  const [nameSearch, setNameSearch] = useState("");
  const [zipSearch, setZipSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  return (
    <Box sx={{ bgcolor: "#f0f0f0", p: 2, borderRadius: 2 }}>
      <TextField
        placeholder="Buscar por nombre o ubicación"
        fullWidth
        value={nameSearch}
        onChange={(e) => setNameSearch(e.target.value)}
        variant="outlined"
        sx={{
          mb: 1,
          borderRadius: 99,
          bgcolor: "#ffffff",
          "& .MuiOutlinedInput-root": {
            borderRadius: 99,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#ff007f" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        placeholder="Buscar por zip code"
        fullWidth
        value={zipSearch}
        onChange={(e) => setZipSearch(e.target.value)}
        variant="outlined"
        sx={{
          mb: 1,
          borderRadius: 99,
          bgcolor: "#ffffff",
          "& .MuiOutlinedInput-root": {
            borderRadius: 99,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#ff007f" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        placeholder="Buscar por turno disponible"
        fullWidth
        value={typeSearch}
        onChange={(e) => setTypeSearch(e.target.value)}
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 99,
          bgcolor: "#ffffff",
          "& .MuiOutlinedInput-root": {
            borderRadius: 99,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#ff007f" }} />
            </InputAdornment>
          ),
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={1}
      >
        <Typography fontWeight={700}>Turnos</Typography>
        <Select
          value="available"
          onChange={() => {}}
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: 99,
            bgcolor: "#fff",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            px: 1,
          }}
        >
          <MenuItem value="available">Disponibles ({availableCount})</MenuItem>
          <MenuItem value="requested">Solicitados</MenuItem>
          <MenuItem value="confirmed">Confirmados</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default ShiftFilters;
