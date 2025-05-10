import api from './api';

// Description: Analyze user symptoms and provide holistic recommendations
// Endpoint: POST /api/wellness/analyze-symptoms
// Request: { name: string, age: string, location: string, symptoms: string }
// Response: { result: { ayurvedic: string, holistic: string, lifestyle: string } }
export const analyzeSymptoms = async (data: { name: string; age: string; location: string; symptoms: string }) => {
  try {
    console.log('Sending symptom analysis request:', data);
    const response = await api.post('/api/wellness/analyze-symptoms', data);
    console.log('Symptom analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Symptom analysis error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get analysis for a specific symptom record
// Endpoint: GET /api/wellness/{symptomId}/analysis
// Response: { result: { ayurvedic: string, holistic: string, lifestyle: string } }
export const getSymptomAnalysis = async (symptomId: string) => {
  try {
    console.log('Fetching analysis for symptom ID:', symptomId);
    const response = await api.get(`/api/wellness/${symptomId}/analysis`);
    console.log('Symptom analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching symptom analysis:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Find nearby doctors and healthcare providers
// Endpoint: GET /api/wellness/nearby-doctors
// Request: { location: string }
// Response: { doctors: Array<{ name: string, specialty: string, address: string, lat: number, lng: number }> }
export const findNearbyDoctors = (location: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        doctors: [
          {
            name: "Dr. Ayush Sharma",
            specialty: "Ayurvedic Practitioner",
            address: "123 Wellness Street, New Delhi",
            lat: 28.6139,
            lng: 77.2090
          },
          {
            name: "Dr. Priya Patel",
            specialty: "Holistic Medicine",
            address: "456 Healing Avenue, New Delhi",
            lat: 28.6229,
            lng: 77.2100
          },
          {
            name: "Yoga Center & Ayurveda",
            specialty: "Wellness Center",
            address: "789 Tranquil Road, New Delhi",
            lat: 28.6179,
            lng: 77.2080
          },
          {
            name: "Dr. Rajesh Kumar",
            specialty: "Naturopathy",
            address: "101 Natural Path, New Delhi",
            lat: 28.6150,
            lng: 77.2150
          }
        ]
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/wellness/nearby-doctors?location=${encodeURIComponent(location)}`);
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get medicine information by name or image
// Endpoint: POST /api/wellness/medicine-info
// Request: { name?: string, image?: string }
// Response: { medicine: { name: string, category: string, description: string, uses: string[], sideEffects: string[], warnings?: string, image?: string } }
export const getMedicineInfo = (data: { name?: string; image?: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        medicine: {
          name: data.name || "Ashwagandha",
          category: "Ayurvedic Herb",
          description: "Ashwagandha is an ancient medicinal herb with multiple health benefits. It's classified as an adaptogen, meaning it can help your body manage stress.",
          uses: [
            "Reduces stress and anxiety",
            "May help reduce blood sugar levels",
            "Might improve sleep quality",
            "Can boost testosterone and increase fertility in men",
            "May increase muscle mass and strength"
          ],
          sideEffects: [
            "Drowsiness",
            "Upset stomach",
            "Diarrhea"
          ],
          warnings: "Pregnant women should avoid ashwagandha as it may cause early delivery. People with autoimmune diseases should consult with a healthcare provider before taking it.",
          image: "/assets/images/ashwagandha.jpg"
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/wellness/medicine-info', data);
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get yoga recommendations based on symptoms
// Endpoint: POST /api/wellness/yoga-recommendations
// Request: { symptoms: string }
// Response: { recommendations: Array<{ name: string, description: string, benefits: string[], difficulty: string, thumbnail: string, videoUrl: string, detailsUrl: string }> }
export const getYogaRecommendations = (symptoms: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recommendations: [
          {
            name: "Bhujangasana (Cobra Pose)",
            description: "A gentle backbend that opens the chest and strengthens the spine.",
            benefits: ["Improves posture", "Reduces stress", "Opens chest"],
            difficulty: "Beginner",
            thumbnail: "/assets/images/yoga/cobra-pose.jpg",
            videoUrl: "https://www.youtube.com/watch?v=example1",
            detailsUrl: "https://www.yogajournal.com/poses/cobra-pose/"
          },
          {
            name: "Balasana (Child's Pose)",
            description: "A restful pose that gently stretches the hips, thighs, and ankles.",
            benefits: ["Relieves stress", "Calms the mind", "Gentle hip opener"],
            difficulty: "Beginner",
            thumbnail: "/assets/images/yoga/childs-pose.jpg",
            videoUrl: "https://www.youtube.com/watch?v=example2",
            detailsUrl: "https://www.yogajournal.com/poses/child-s-pose/"
          },
          {
            name: "Adho Mukha Svanasana (Downward-Facing Dog)",
            description: "An all-over stretch that builds strength and increases flexibility.",
            benefits: ["Energizes the body", "Stretches shoulders", "Strengthens arms"],
            difficulty: "Beginner",
            thumbnail: "/assets/images/yoga/downward-dog.jpg",
            videoUrl: "https://www.youtube.com/watch?v=example3",
            detailsUrl: "https://www.yogajournal.com/poses/downward-facing-dog/"
          },
          {
            name: "Viparita Karani (Legs-Up-The-Wall Pose)",
            description: "A restorative inversion that helps calm the nervous system.",
            benefits: ["Reduces anxiety", "Improves circulation", "Relieves tired legs"],
            difficulty: "Beginner",
            thumbnail: "/assets/images/yoga/legs-up-wall.jpg",
            videoUrl: "https://www.youtube.com/watch?v=example4",
            detailsUrl: "https://www.yogajournal.com/poses/legs-up-the-wall-pose/"
          }
        ]
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/wellness/yoga-recommendations', { symptoms });
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get upcoming wellness workshops
// Endpoint: GET /api/wellness/workshops
// Response: { workshops: Array<{ _id: string, title: string, description: string, date: string, duration: number, instructor: string, location: string, seatsAvailable: number, isBooked: boolean }> }
export const getWorkshops = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        workshops: [
          {
            _id: "w1",
            title: "Mindfulness Meditation Workshop",
            description: "Learn the basics of mindfulness meditation and how to incorporate it into your daily routine for better mental health and stress reduction.",
            date: "2023-07-15T10:00:00Z",
            duration: 120,
            instructor: "Dr. Sarah Johnson",
            location: "Wellness Center, 123 Peace Street",
            seatsAvailable: 8,
            isBooked: false
          },
          {
            _id: "w2",
            title: "Yoga for Beginners",
            description: "A gentle introduction to yoga poses and breathing techniques suitable for all fitness levels.",
            date: "2023-07-18T14:00:00Z",
            duration: 90,
            instructor: "Maya Patel",
            location: "Green Park Community Center",
            seatsAvailable: 5,
            isBooked: false
          },
          {
            _id: "w3",
            title: "Ayurvedic Cooking Class",
            description: "Learn how to prepare delicious and nutritious meals according to Ayurvedic principles.",
            date: "2023-07-20T11:00:00Z",
            duration: 150,
            instructor: "Chef Ravi Kumar",
            location: "Holistic Kitchen Studio",
            seatsAvailable: 10,
            isBooked: false
          },
          {
            _id: "w4",
            title: "Sound Healing Session",
            description: "Experience the therapeutic effects of sound vibrations using singing bowls and other instruments.",
            date: "2023-07-22T18:00:00Z",
            duration: 60,
            instructor: "Anita Desai",
            location: "Harmony Healing Center",
            seatsAvailable: 15,
            isBooked: false
          },
          {
            _id: "w5",
            title: "Stress Management Workshop",
            description: "Practical techniques to manage stress and anxiety in your daily life.",
            date: "2023-07-25T16:00:00Z",
            duration: 120,
            instructor: "Dr. Michael Wong",
            location: "Mind & Body Wellness Institute",
            seatsAvailable: 12,
            isBooked: false
          }
        ]
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/wellness/workshops');
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Book a workshop
// Endpoint: POST /api/wellness/book-workshop
// Request: { workshopId: string }
// Response: { success: boolean, message: string }
export const bookWorkshop = (workshopId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Workshop booked successfully"
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/wellness/book-workshop', { workshopId });
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};