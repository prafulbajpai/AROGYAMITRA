import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import { getWorkshops, bookWorkshop } from "@/api/wellness";
import { useToast } from "@/hooks/useToast";
import { format } from "date-fns";

export function WellnessWorkshops() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkshops = async () => {
      setIsLoading(true);
      try {
        const response = await getWorkshops();
        setWorkshops(response.workshops);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load workshops. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, [toast]);

  const handleBookWorkshop = async (workshopId: string) => {
    setIsBooking(true);
    try {
      await bookWorkshop(workshopId);
      toast({
        title: "Booking Successful",
        description: "You have successfully booked this workshop.",
      });

      // Update the workshops list to reflect the booking
      setWorkshops(workshops.map(workshop =>
        workshop._id === workshopId
          ? { ...workshop, seatsAvailable: workshop.seatsAvailable - 1, isBooked: true }
          : workshop
      ));

      setSelectedWorkshop(null);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking this workshop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Filter workshops for the selected date in calendar view
  const filteredWorkshops = date
    ? workshops.filter(workshop => {
        const workshopDate = new Date(workshop.date);
        return workshopDate.toDateString() === date.toDateString();
      })
    : workshops;

  // Get dates that have workshops for highlighting in calendar
  const workshopDates = workshops.map(workshop => new Date(workshop.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Upcoming Workshops & Sessions</h3>
        <Tabs value={view} onValueChange={(value) => setView(value as "list" | "calendar")} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="list" className="mt-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-green-200 dark:border-green-800">
                <CardHeader className="animate-pulse bg-green-50 dark:bg-green-900/20 h-24" />
                <CardContent className="p-4">
                  <div className="h-4 bg-green-100 dark:bg-green-800/40 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-green-100 dark:bg-green-800/40 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((workshop) => (
              <Card
                key={workshop._id}
                className={`border-green-200 dark:border-green-800 overflow-hidden transition-all ${
                  workshop.isBooked ? "border-green-500 dark:border-green-500" : ""
                }`}
              >
                <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 relative">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="bg-white/90 text-green-800">
                        {format(new Date(workshop.date), "MMM d, yyyy")}
                      </Badge>
                      {workshop.isBooked && (
                        <Badge className="bg-green-600">Booked</Badge>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{workshop.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-700 dark:text-green-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(new Date(workshop.date), "h:mm a")} - {workshop.duration} mins
                    </div>
                    <div className="flex items-center text-sm text-green-700 dark:text-green-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {workshop.location}
                    </div>
                    <div className="flex items-center text-sm text-green-700 dark:text-green-400">
                      <Users className="h-4 w-4 mr-2" />
                      {workshop.seatsAvailable} seats available
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      By {workshop.instructor}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30"
                        onClick={() => setSelectedWorkshop(workshop)}
                      >
                        Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-green-800 dark:text-green-300">{selectedWorkshop?.title}</DialogTitle>
                        <DialogDescription>
                          {selectedWorkshop?.date && format(new Date(selectedWorkshop.date), "MMMM d, yyyy")} at {selectedWorkshop?.date && format(new Date(selectedWorkshop.date), "h:mm a")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-green-700 dark:text-green-400">{selectedWorkshop?.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                            <span className="font-medium">Instructor:</span>
                            <span className="ml-2">{selectedWorkshop?.instructor}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-2">{selectedWorkshop?.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                            <span className="font-medium">Duration:</span>
                            <span className="ml-2">{selectedWorkshop?.duration} minutes</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                            <span className="font-medium">Available Seats:</span>
                            <span className="ml-2">{selectedWorkshop?.seatsAvailable}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleBookWorkshop(selectedWorkshop?._id)}
                          disabled={isBooking || selectedWorkshop?.seatsAvailable === 0 || selectedWorkshop?.isBooked}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isBooking ? "Booking..." : selectedWorkshop?.isBooked ? "Already Booked" : "Book Now"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="calendar" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasWorkshop: workshopDates,
                }}
                modifiersStyles={{
                  hasWorkshop: {
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "100%",
                    fontWeight: "bold",
                    color: "#16a34a",
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card className="border-green-200 dark:border-green-800 h-full">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredWorkshops.length === 0 ? (
                  <div className="text-center py-8 text-green-600 dark:text-green-400">
                    No workshops scheduled for this date.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWorkshops.map((workshop) => (
                      <div
                        key={workshop._id}
                        className="flex items-center justify-between p-3 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">{workshop.title}</h4>
                          <div className="flex items-center text-sm text-green-700 dark:text-green-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(workshop.date), "h:mm a")} - {workshop.duration} mins
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30"
                              onClick={() => setSelectedWorkshop(workshop)}
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-green-800 dark:text-green-300">{selectedWorkshop?.title}</DialogTitle>
                              <DialogDescription>
                                {selectedWorkshop?.date && format(new Date(selectedWorkshop.date), "MMMM d, yyyy")} at {selectedWorkshop?.date && format(new Date(selectedWorkshop.date), "h:mm a")}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <p className="text-green-700 dark:text-green-400">{selectedWorkshop?.description}</p>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                                  <span className="font-medium">Instructor:</span>
                                  <span className="ml-2">{selectedWorkshop?.instructor}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                                  <span className="font-medium">Location:</span>
                                  <span className="ml-2">{selectedWorkshop?.location}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                                  <span className="font-medium">Duration:</span>
                                  <span className="ml-2">{selectedWorkshop?.duration} minutes</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                                  <span className="font-medium">Available Seats:</span>
                                  <span className="ml-2">{selectedWorkshop?.seatsAvailable}</span>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => handleBookWorkshop(selectedWorkshop?._id)}
                                disabled={isBooking || selectedWorkshop?.seatsAvailable === 0 || selectedWorkshop?.isBooked}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isBooking ? "Booking..." : selectedWorkshop?.isBooked ? "Already Booked" : "Book Now"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </div>
  );
}