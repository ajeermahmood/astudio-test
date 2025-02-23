'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setProductSearchQuery, setProductCategoryFilter } from '@/lib/store/filters/slice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DropdownFilter from '@/components/common/DropdownFilter';

export default function ProductFilters() {
  const dispatch = useAppDispatch();
  const { productSearchQuery } = useAppSelector(state => state.filters);
  const [localSearch, setLocalSearch] = useState(productSearchQuery);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setProductSearchQuery(localSearch));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, dispatch]);

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ebebeb] focus:border-[#c0e3e5] focus:ring-2 focus:ring-[#c0e3e5] transition-all"
        />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
      </div>

      {/* Category Filter */}
      <DropdownFilter
        options={[
          { value: 'all', label: 'All Categories' },
          { value: 'laptops', label: 'Laptops' },
          { value: 'smartphones', label: 'Smartphones' },
          { value: 'fragrances', label: 'Fragrances' },
        ]}
        selectedValue={useAppSelector(state => state.filters.productCategory)}
        onChange={(value) => dispatch(setProductCategoryFilter(String(value)))}
        label="Category"
      />
    </div>
  );
}