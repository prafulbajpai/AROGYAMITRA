import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Play, ExternalLink, Flower2 } from "lucide-react";
import { getYogaRecommendations } from "@/api/wellness";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  symptoms: z.string().min(5, { message: "Please describe your symptoms in more detail." }),
});

type FormValues = z.infer<typeof formSchema>;

export function YogaTherapy() {
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSearching(true);
    try {
      const response = await getYogaRecommendations(data.symptoms);
      setRecommendations(response.recommendations);
      toast({
        title: "Recommendations Ready",
        description: "We've found yoga poses that may help with your symptoms.",
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error finding yoga recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe Your Symptoms</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your symptoms or health concerns..."
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
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Yoga Poses...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Yoga Poses
              </>
            )}
          </Button>
        </form>
      </Form>

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Recommended Yoga Poses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((item, index) => (
              <Card key={index} className="overflow-hidden border-green-200 dark:border-green-800">
                <div className="aspect-video relative">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => window.open(item.videoUrl, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">{item.name}</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.benefits.map((benefit: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-green-600 dark:text-green-500">
                      Difficulty: {item.difficulty}
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-green-600 dark:text-green-400 p-0 h-auto"
                      onClick={() => window.open(item.detailsUrl, '_blank')}
                    >
                      Learn More <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}