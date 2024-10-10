"use client"
import React from 'react';

interface SortDropdownProps {
  sortBy: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SortDropdown({ sortBy, onChange }: SortDropdownProps) {
  return (
    <select value={sortBy} onChange={onChange} className="border p-2 mb-4 text-gray-600 placeholder-gray-500">
      <option value="priceAfter">Sort by Price</option> {/* Default selected */}
      <option value="type">Sort by Type</option>
      <option value="place">Sort by Place</option>
    </select>
  );
}
