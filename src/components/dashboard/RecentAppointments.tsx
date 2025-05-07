
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  htpiScore: number;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{appointment.doctor}</h3>
                  <span className={`text-sm font-bold ${getScoreColor(appointment.htpiScore)}`}>
                    H-TPI: {appointment.htpiScore.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{appointment.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(appointment.date)} at {appointment.time}
                </p>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No recent appointments
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
