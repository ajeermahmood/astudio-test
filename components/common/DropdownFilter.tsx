import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface DropdownFilterProps {
  options: { value: string | number; label: string }[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  label?: string;
}

export default function DropdownFilter({
  options,
  selectedValue,
  onChange,
  label,
}: DropdownFilterProps) {
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <Listbox value={selectedValue} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          {label && (
            <Listbox.Label className="block text-sm font-medium text-[#322625] mb-1">
              {label}
            </Listbox.Label>
          )}
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg border border-[#ebebeb] cursor-default focus:outline-none focus:ring-2 focus:ring-[#c0e3e5] focus:border-[#c0e3e5] sm:text-sm">
            <span className="block truncate">{selectedOption?.label}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `${
                      active
                        ? "text-[#322625] bg-[#fdc936]/50"
                        : "text-[#322625]"
                    } cursor-default select-none relative py-2 pl-3 pr-9`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-semibold" : "font-normal"
                        } block truncate`}
                      >
                        {option.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
