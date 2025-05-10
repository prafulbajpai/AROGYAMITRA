import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Upload, AlertCircle } from "lucide-react";
import { getMedicineInfo } from "@/api/wellness";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  medicineName: z.string().min(2, { message: "Medicine name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export function MedicineInfo() {
  const [isSearching, setIsSearching] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<any>(null);
  const [searchMethod, setSearchMethod] = useState<"text" | "image">("text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineName: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSearching(true);
    try {
      const response = await getMedicineInfo({ name: data.medicineName });
      setMedicineInfo(response.medicine);
      toast({
        title: "Medicine Found",
        description: "We've found information about the requested medicine.",
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error finding the medicine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);

        setIsSearching(true);
        try {
          // In a real app, you'd send the image to the server
          // Here we're using a timeout to simulate the API call
          setTimeout(async () => {
            const response = await getMedicineInfo({ image: "uploaded_image" });
            setMedicineInfo(response.medicine);
            toast({
              title: "Medicine Identified",
              description: "We've identified the medicine from your image.",
            });
            setIsSearching(false);
          }, 2000);
        } catch (error) {
          toast({
            title: "Identification Failed",
            description: "There was an error identifying the medicine. Please try again.",
            variant: "destructive",
          });
          setIsSearching(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <Tabs value={searchMethod} onValueChange={(value) => setSearchMethod(value as "text" | "image")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Search by Name</TabsTrigger>
          <TabsTrigger value="image">Upload Image</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="medicineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter medicine name..." {...field} />
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
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Medicine
                  </>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="image" className="pt-4">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
              <label htmlFor="medicine-image" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Medicine preview"
                      className="mx-auto max-h-64 rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <p className="text-white font-medium">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                      PNG, JPG or JPEG (max 5MB)
                    </p>
                  </div>
                )}
                <input
                  id="medicine-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isSearching}
                />
              </label>
            </div>

            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSearching || !imagePreview}
              onClick={() => {
                if (imagePreview) {
                  setIsSearching(true);
                  // In a real app, you'd send the image to the server again
                  setTimeout(async () => {
                    const response = await getMedicineInfo({ image: "uploaded_image" });
                    setMedicineInfo(response.medicine);
                    toast({
                      title: "Medicine Identified",
                      description: "We've identified the medicine from your image.",
                    });
                    setIsSearching(false);
                  }, 2000);
                }
              }}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Identifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Identify Medicine
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {medicineInfo && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {medicineInfo.image && (
                <img
                  src={medicineInfo.image}
                  alt={medicineInfo.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">{medicineInfo.name}</h3>
                <p className="text-sm text-green-600 dark:text-green-400">{medicineInfo.category}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Description:</h4>
                <p className="text-green-800 dark:text-green-300">{medicineInfo.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Uses:</h4>
                <ul className="list-disc pl-5 text-green-800 dark:text-green-300">
                  {medicineInfo.uses.map((use: string, index: number) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Side Effects:</h4>
                <ul className="list-disc pl-5 text-green-800 dark:text-green-300">
                  {medicineInfo.sideEffects.map((effect: string, index: number) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>

              {medicineInfo.warnings && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md flex items-start gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-500">Important Warnings:</h4>
                    <p className="text-yellow-700 dark:text-yellow-400">{medicineInfo.warnings}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}