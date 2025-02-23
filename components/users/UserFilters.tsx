'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setAgeGroupFilter, setGenderFilter, setPageSize, setSearchQuery } from '@/lib/store/filters/slice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DropdownFilter from '@/components/common/DropdownFilter';

export default function UserFilters() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(state => state.filters);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, dispatch]);

  const pageSizeOptions = [
    { value: 5, label: '5 items' },
    { value: 10, label: '10 items' },
    { value: 20, label: '20 items' },
    { value: 50, label: '50 items' },
  ];

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-grow">
        {showSearch && (
          <input
            type="text"
            placeholder="Search users..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ebebeb] focus:border-[#c0e3e5] focus:ring-2 focus:ring-[#c0e3e5] transition-all"
          />
        )}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 ${
            showSearch ? 'text-[#322625]' : 'text-gray-400'
          } hover:text-[#322625] transition-colors`}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Page Size Dropdown */}
      <DropdownFilter
        options={pageSizeOptions}
        selectedValue={useAppSelector(state => state.users.pagination.pageSize)}
        onChange={(value) => dispatch(setPageSize(Number(value)))}
        label="Items per page"
      />

      {/* Additional Filters */}
      <div className="flex space-x-4">
        <DropdownFilter
          options={[
            { value: 'all', label: 'All Genders' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          selectedValue={useAppSelector(state => state.filters.gender)}
          onChange={(value) => dispatch(setGenderFilter(String(value)))}
          label="Gender"
        />

        <DropdownFilter
          options={[
            { value: 'all', label: 'All Ages' },
            { value: '18-25', label: '18-25' },
            { value: '26-40', label: '26-40' },
            { value: '41+', label: '41+' },
          ]}
          selectedValue={useAppSelector(state => state.filters.ageGroup)}
          onChange={(value) => dispatch(setAgeGroupFilter(String(value)))}
          label="Age Group"
        />
      </div>
    </div>
  );
}