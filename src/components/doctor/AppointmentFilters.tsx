import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { AppointmentStatus, PaymentStatus } from './types';

interface AppointmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AppointmentStatus | 'all';
  onStatusFilterChange: (status: AppointmentStatus | 'all') => void;
  paymentFilter: PaymentStatus | 'all';
  onPaymentFilterChange: (status: PaymentStatus | 'all') => void;
  onReset: () => void;
}

export const AppointmentFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  onReset,
}: AppointmentFiltersProps) => (
  <div className="flex items-center gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search appointments..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="upcoming">Upcoming</SelectItem>
        <SelectItem value="finished">Finished</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
    <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Payment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="refunded">Refunded</SelectItem>
      </SelectContent>
    </Select>
    <Button variant="outline" size="icon" onClick={onReset}>
      <X className="h-4 w-4" />
    </Button>
  </div>
); 