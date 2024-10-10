"use client"
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ searchTerm, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={onChange}
      placeholder="Search for groceries..."
      className="border rounded p-2 mb-4 text-black placeholder-gray-500"
    />
  );
}
