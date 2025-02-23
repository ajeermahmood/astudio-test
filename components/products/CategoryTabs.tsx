'use client';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setProductCategoryFilter } from '@/lib/store/filters/slice';

export default function CategoryTabs() {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(state => state.filters.productCategory);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'laptops', label: 'Laptops' },
  ];

  return (
    <div className="flex space-x-4 mb-6">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => dispatch(setProductCategoryFilter(category.value))}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === category.value
              ? 'bg-[#fdc936] text-[#322625]'
              : 'bg-[#ebebeb] text-[#322625] hover:bg-[#c0e3e5]'
          } transition-colors`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}