import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymptomAnalysis } from "@/components/features/SymptomAnalysis";
import { MedicineInfo } from "@/components/features/MedicineInfo";
import { YogaTherapy } from "@/components/features/YogaTherapy";
import { WellnessWorkshops } from "@/components/features/WellnessWorkshops";
import { MeditationTimer } from "@/components/features/MeditationTimer";
import { Stethoscope, Pill, Flower2, Calendar, Timer } from "lucide-react";

export function HomePage() {
  const [activeTab, setActiveTab] = useState("symptom-analysis");

  const features = [
    { id: "symptom-analysis", name: "Symptom Analysis", icon: <Stethoscope className="h-5 w-5" />, component: <SymptomAnalysis /> },
    { id: "medicine-info", name: "Medicine Information", icon: <Pill className="h-5 w-5" />, component: <MedicineInfo /> },
    { id: "yoga-therapy", name: "Yoga Therapy", icon: <Flower2 className="h-5 w-5" />, component: <YogaTherapy /> },
    { id: "wellness-workshops", name: "Wellness Workshops", icon: <Calendar className="h-5 w-5" />, component: <WellnessWorkshops /> },
    { id: "meditation-timer", name: "Meditation Timer", icon: <Timer className="h-5 w-5" />, component: <MeditationTimer /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">Wellness Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-green-100 dark:bg-green-900 p-1 rounded-lg">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-green-800"
              >
                {feature.icon}
                <span className="hidden md:inline">{feature.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-6">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    {feature.icon}
                    {feature.name}
                  </CardTitle>
                  <CardDescription>
                    {feature.id === "symptom-analysis" && "Analyze your symptoms for holistic recommendations"}
                    {feature.id === "medicine-info" && "Get detailed information about medicines"}
                    {feature.id === "yoga-therapy" && "Find yoga poses for your specific health needs"}
                    {feature.id === "wellness-workshops" && "Discover and book upcoming wellness events"}
                    {feature.id === "meditation-timer" && "Track your meditation with a growing tree visualization"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feature.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}