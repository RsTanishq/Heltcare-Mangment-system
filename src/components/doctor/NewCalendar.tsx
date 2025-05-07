import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Appointment, AppointmentStatus, PaymentStatus } from './types';

interface CalendarProps {
  appointments?: Appointment[];
  onNewAppointment?: (appointment: Appointment) => void;
  onDateSelect?: (date: Date) => void;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
];

export const NewCalendar: React.FC<CalendarProps> = ({
  appointments = [],
  onNewAppointment,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    time: '',
    type: 'checkup'
  });

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate).getDay();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(app => app.date === format(date, 'yyyy-MM-dd'));
  };

  const handleNewAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNewAppointment && newAppointment.patientName && newAppointment.time) {
      onNewAppointment({
        id: Math.random().toString(36).substr(2, 9),
        patientId: '', // Will be set by the parent component
        patientImage: '', // Will be set by the parent component
        date: format(selectedDate, 'yyyy-MM-dd'),
        condition: newAppointment.type,
        status: 'upcoming' as AppointmentStatus,
        paymentStatus: 'pending' as PaymentStatus,
        amount: 0, // Will be set by the parent component
        ...newAppointment
      });
      setIsNewAppointmentOpen(false);
      setNewAppointment({ patientName: '', time: '', type: 'checkup' });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setIsNewAppointmentOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6">
          <div className="grid grid-cols-7 gap-px bg-white">
            {/* Calendar Header */}
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase"
              >
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="h-24 p-2 border border-transparent"
              />
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toString()}
                  className={`h-24 p-2 border border-gray-100 transition-colors cursor-pointer hover:bg-gray-50 ${
                    isSelected ? 'bg-indigo-50' : ''
                  } ${isCurrentMonth ? '' : 'opacity-50'}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-indigo-600' : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <div className="mt-1">
                        {dayAppointments.map((apt, index) => (
                          <div
                            key={apt.id}
                            className="text-xs mb-1"
                          >
                            <span className="text-indigo-600 font-medium">
                              {apt.time}
                            </span>
                            <div className="text-gray-600">
                              {apt.patientName}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-4">
          {selectedDate && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <span className="text-sm text-indigo-600 font-medium">
                  {getAppointmentsForDate(selectedDate).length} appointments
                </span>
              </div>

              <div className="space-y-4">
                {getAppointmentsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm mb-4">No appointments scheduled</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewAppointmentOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getAppointmentsForDate(selectedDate).map((appointment: Appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{appointment.patientName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span className="capitalize">{appointment.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input
                placeholder="Enter patient name"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({
                  ...newAppointment,
                  patientName: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select
                value={newAppointment.time}
                onValueChange={(value) => setNewAppointment({
                  ...newAppointment,
                  time: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newAppointment.type}
                onValueChange={(value) => setNewAppointment({
                  ...newAppointment,
                  type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleNewAppointment}
              disabled={!newAppointment.patientName || !newAppointment.time}
            >
              Schedule Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 