import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Heart, Activity, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
      <div className="container mx-auto px-4 py-20">
        <div 
          className="flex flex-col items-center text-center opacity-100 transform translate-y-0 transition-all duration-800"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 dark:text-green-300 mb-6">
            Holistic Wellness Journey
          </h1>
          <p className="text-lg md:text-xl text-green-700 dark:text-green-400 max-w-2xl mb-8">
            Discover natural remedies, personalized wellness solutions, and holistic approaches to health with our comprehensive platform.
          </p>

          <div
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Button
              onClick={() => navigate("/home")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="bg-white/80 dark:bg-green-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg transform transition-all duration-500 opacity-100 translate-y-0"
          >
            <div className="bg-green-100 dark:bg-green-700 p-3 rounded-full w-fit mb-4">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Natural Remedies</h3>
            <p className="text-green-700 dark:text-green-400">Discover traditional and modern natural approaches to common health concerns.</p>
          </div>

          <div
            className="bg-white/80 dark:bg-green-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg transform transition-all duration-500 opacity-100 translate-y-0"
          >
            <div className="bg-green-100 dark:bg-green-700 p-3 rounded-full w-fit mb-4">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Holistic Wellness</h3>
            <p className="text-green-700 dark:text-green-400">Embrace a complete approach to health that considers mind, body, and spirit.</p>
          </div>

          <div
            className="bg-white/80 dark:bg-green-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg transform transition-all duration-500 opacity-100 translate-y-0"
          >
            <div className="bg-green-100 dark:bg-green-700 p-3 rounded-full w-fit mb-4">
              <Activity className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Personalized Care</h3>
            <p className="text-green-700 dark:text-green-400">Get tailored wellness recommendations based on your unique health profile.</p>
          </div>
        </div>

        <div
          className="mt-20 opacity-100 transition-opacity duration-1000"
        >
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Wellness Infographic"
            className="rounded-2xl shadow-xl w-full max-w-4xl mx-auto object-cover h-80"
          />
        </div>
      </div>
    </div>
  );
}