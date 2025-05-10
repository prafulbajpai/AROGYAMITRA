import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Search, Navigation } from "lucide-react";
import { analyzeSymptoms, findNearbyDoctors } from "@/api/wellness";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Age must be a positive number.",
  }),
  location: z.string().min(2, { message: "Location is required." }),
  symptoms: z.string().min(10, { message: "Please describe your symptoms in more detail." }),
});

type FormValues = z.infer<typeof formSchema>;

export function SymptomAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      symptoms: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeSymptoms(data);
      setResult(response.result);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your symptoms and provided recommendations.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFindDoctors = async () => {
    try {
      const response = await findNearbyDoctors(form.getValues().location);
      setDoctors(response.doctors);
      setShowMap(true);
      toast({
        title: "Doctors Found",
        description: `Found ${response.doctors.length} healthcare providers near you.`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error finding doctors. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("location", `${position.coords.latitude}, ${position.coords.longitude}`);
          toast({
            title: "Location Found",
            description: "Your current location has been detected.",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="Enter your location" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getUserLocation}
                    className="flex-shrink-0"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Detect
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptoms Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your symptoms in detail..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">Recommendations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Ayurvedic Approach:</h4>
                <p className="text-green-800 dark:text-green-300">{result.ayurvedic}</p>
              </div>
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Holistic Recommendations:</h4>
                <p className="text-green-800 dark:text-green-300">{result.holistic}</p>
              </div>
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Lifestyle Changes:</h4>
                <p className="text-green-800 dark:text-green-300">{result.lifestyle}</p>
              </div>

              <Button
                onClick={handleFindDoctors}
                variant="outline"
                className="mt-4 border-green-600 text-green-700 hover:bg-green-100 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-800/50"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find Healthcare Providers Near Me
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showMap && doctors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">Nearby Healthcare Providers</h3>
          <div className="h-[400px] rounded-lg overflow-hidden border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor, index) => (
                <Card key={index} className="border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300">{doctor.name}</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">{doctor.specialty}</p>
                    <p className="text-sm text-green-700 dark:text-green-400">{doctor.address}</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white w-full"
                      onClick={() => window.open(`https://maps.google.com/maps?daddr=${doctor.lat},${doctor.lng}`, '_blank')}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}