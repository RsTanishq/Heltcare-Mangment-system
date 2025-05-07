
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  topics: number;
  duration: string;
  speakers: number;
  capacity: number;
}

interface EventsCardProps {
  events: Event[];
}

const EventsCard: React.FC<EventsCardProps> = ({ events }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Today's Events</CardTitle>
          <p className="text-sm text-gray-500">17 events on all activities</p>
        </div>
        <a href="#" className="text-sm font-medium text-green-500 hover:text-green-600">
          See All
        </a>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">{event.title}</h3>
              
              <div className="mb-3 flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{event.date}, {event.time}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-1.5">⭐</span>
                  <span>{event.topics} Topics</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1.5 h-3 w-3" />
                  <span>{event.duration}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-1.5">🗣️</span>
                  <span>{event.speakers} Speaker{event.speakers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="mr-1.5 h-3 w-3" />
                  <span>{event.capacity} Capacity</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
                  Detail
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 flex-1">
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCard;
