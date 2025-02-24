import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomDatePicker from "./CustomDatePicker";

export type FilterType = "dropdown" | "date";

export interface AdditionalFilter {
  key: string;
  label: string;
  type?: FilterType;
  options?: string[];
}

interface FiltersProps {
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  onFilterChange: (filter: string, value: string) => void;
  clientSideFilter: boolean;
  additionalFilters?: AdditionalFilter[];
  currentTab?: string;
}

const Filters: React.FC<FiltersProps> = ({
  pageSize,
  onPageSizeChange,
  onFilterChange,
  clientSideFilter,
  additionalFilters = [],
  currentTab,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeServerFilter, setActiveServerFilter] = useState<{
    key: string;
    value: string;
  }>({ key: "", value: "" });
  const [searchValue, setSearchValue] = useState("");

  const hasActiveFilters =
    searchValue.trim() !== "" || activeServerFilter.value !== "";

  useEffect(() => {
    const additionalFiltersActive = additionalFilters.some(
      (filter) =>
        activeServerFilter.key === filter.key && activeServerFilter.value !== ""
    );

    if (searchValue.trim() !== "" || additionalFiltersActive) {
    }
  }, [searchValue, activeServerFilter, additionalFilters]);

  const handleSearchIconClick = () => {
    setSearchOpen((prev) => !prev);
    setActiveServerFilter({ key: "", value: "" });
    onFilterChange("client", "");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onFilterChange("client", value);
    setActiveServerFilter({ key: "", value: "" });
  };

  const handlePageSizeChange = (event: any) => {
    onPageSizeChange(event.target.value);
  };

  const handleAdditionalFilterChange = (key: string, value: string) => {
    setActiveServerFilter({ key, value });
    setSearchValue("");
    onFilterChange(key, value);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setActiveServerFilter({ key: "", value: "" });
    onFilterChange("client", "");
    additionalFilters.forEach((filter) => onFilterChange(filter.key, ""));
  };

  useEffect(() => {
    handleClearFilters();
  }, [currentTab]);

  return (
    <div className="flex flex-wrap items-end space-x-4 mb-4 mt-3">
      <FormControl variant="outlined" size="small" className="min-w-[100px]">
        <InputLabel id="page-size-label">Page Size</InputLabel>
        <Select
          labelId="page-size-label"
          value={pageSize}
          onChange={handlePageSizeChange}
          label="Page Size"
        >
          {[5, 10, 20, 50].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={handleSearchIconClick} color="primary">
        <SearchIcon />
      </IconButton>
      {searchOpen && (
        <TextField
          size="small"
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      )}
      {additionalFilters.map((filter) => {
        const value =
          activeServerFilter.key === filter.key ? activeServerFilter.value : "";
        return (
          <div key={filter.key} className="min-w-[150px]">
            {filter.type === "date" ? (
              <CustomDatePicker
                filter={filter}
                value={value}
                onChange={handleAdditionalFilterChange}
              />
            ) : (
              <FormControl
                key={filter.key}
                variant="outlined"
                size="small"
                fullWidth
              >
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  value={value}
                  onChange={(e) =>
                    handleAdditionalFilterChange(
                      filter.key,
                      e.target.value as string
                    )
                  }
                  label={filter.label}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflowY: "auto",
                      },
                    },
                  }}
                >
                  {filter.options?.map((option, i) => (
                    <MenuItem key={option + i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        );
      })}
      <Button
        className="py-[7.4px] px-[20px]"
        variant="outlined"
        color="primary"
        startIcon={<ClearIcon />}
        onClick={handleClearFilters}
        disabled={!hasActiveFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default Filters;
