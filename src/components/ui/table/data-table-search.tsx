'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { useState, useEffect } from 'react';

interface DataTableSearchProps {
  searchKey: string;
  setSearchQuery: (value: string) => void;
}
export function DataTableSearch({
  searchKey,
  setSearchQuery
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();
  const [interalSearch, setInternalSearch] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Input
      placeholder={`Tìm kiếm theo ${searchKey}...`}
      value={interalSearch ?? ''}
      onChange={(e) => {
        setInternalSearch(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch(interalSearch);
        }
      }}
      className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
    />
  );
}
