const Symptom = require('../models/Symptom');
const { sendLLMRequest } = require('./llmService');

class SymptomService {
  static async create(symptomData) {
    try {
      const symptom = new Symptom(symptomData);
      await symptom.save();
      return symptom;
    } catch (err) {
      throw new Error(`Error creating symptom record: ${err.message}`);
    }
  }

  static async getByUserId(userId) {
    try {
      return await Symptom.find({ userId }).sort({ createdAt: -1 });
    } catch (err) {
      throw new Error(`Error fetching symptoms for user: ${err.message}`);
    }
  }

  static async get(id) {
    try {
      return await Symptom.findById(id);
    } catch (err) {
      throw new Error(`Error fetching symptom: ${err.message}`);
    }
  }

  static async analyzeSymptomById(symptomId) {
    try {
      const symptomRecord = await this.get(symptomId);
      
      if (!symptomRecord) {
        throw new Error('Symptom record not found');
      }
      
      return this.analyzeSymptoms({
        name: symptomRecord.name,
        age: symptomRecord.age,
        location: symptomRecord.location,
        symptoms: symptomRecord.symptoms
      });
    } catch (err) {
      throw new Error(`Error analyzing symptom record: ${err.message}`);
    }
  }

  static async analyzeSymptoms(symptomData) {
    try {
      console.log('Analyzing symptoms:', symptomData);
      
      // In a production environment, we would use the LLM service here
      // const prompt = `Analyze the following symptoms and provide ayurvedic, holistic, and lifestyle recommendations:
      // Patient: ${symptomData.name}, Age: ${symptomData.age}
      // Symptoms: ${symptomData.symptoms}
      // Format your response as JSON with the following structure:
      // {
      //   "ayurvedic": "detailed ayurvedic recommendations",
      //   "holistic": "detailed holistic approach recommendations",
      //   "lifestyle": "detailed lifestyle change recommendations"
      // }`;
      
      // const llmResponse = await sendLLMRequest('openai', 'gpt-4', prompt);
      // try {
      //   return JSON.parse(llmResponse);
      // } catch (e) {
      //   console.error('Failed to parse LLM response as JSON:', e);
      //   // Fall back to mock analysis
      // }

      // Mock analysis based on symptoms text
      const symptoms = symptomData.symptoms.toLowerCase();
      
      let ayurvedicRecommendation = "Based on your symptoms, we recommend incorporating turmeric, ginger, and holy basil into your diet. These have anti-inflammatory properties that may help reduce your symptoms. Consider a daily routine that includes oil massage (abhyanga) and meditation.";
      let holisticRecommendation = "Your symptoms may benefit from regular gentle yoga practice, particularly poses that open the chest and improve circulation. Consider adding more leafy greens and reducing processed foods in your diet.";
      let lifestyleRecommendation = "Try to establish a regular sleep schedule, going to bed before 10 PM. Reduce screen time before bed and practice deep breathing exercises for 10 minutes each morning.";
      
      // Customize based on common symptoms
      if (symptoms.includes("headache") || symptoms.includes("head pain")) {
        ayurvedicRecommendation = "For headaches, we recommend a cooling diet with coconut water, fennel tea, and avoiding spicy foods. Apply diluted peppermint oil to temples and practice Sheetali pranayama (cooling breath).";
        holisticRecommendation = "Consider magnesium supplements and ensure proper hydration. Gentle neck stretches and acupressure at temples may provide relief.";
        lifestyleRecommendation = "Reduce screen time and ensure proper lighting in your workspace. Take regular breaks and practice eye relaxation exercises.";
      } else if (symptoms.includes("stomach") || symptoms.includes("digestion") || symptoms.includes("nausea")) {
        ayurvedicRecommendation = "For digestive issues, try incorporating cumin, coriander, and fennel tea after meals. Ginger tea before meals can stimulate digestion. Consider triphala before bed for overall digestive health.";
        holisticRecommendation = "Focus on smaller, more frequent meals and proper food combining. Probiotics and fermented foods may help restore gut balance.";
        lifestyleRecommendation = "Practice mindful eating by chewing thoroughly and avoiding eating when stressed. A short walk after meals can aid digestion.";
      } else if (symptoms.includes("stress") || symptoms.includes("anxiety") || symptoms.includes("sleep")) {
        ayurvedicRecommendation = "For stress and sleep issues, try ashwagandha supplements and warm milk with nutmeg before bed. Practice oil self-massage (abhyanga) with sesame oil before showering.";
        holisticRecommendation = "Consider adaptogenic herbs like rhodiola and holy basil. Magnesium glycinate supplements may improve sleep quality.";
        lifestyleRecommendation = "Establish a calming bedtime routine and avoid blue light 2 hours before sleep. Practice 4-7-8 breathing technique when feeling anxious.";
      }
      
      return {
        ayurvedic: ayurvedicRecommendation,
        holistic: holisticRecommendation,
        lifestyle: lifestyleRecommendation
      };
    } catch (err) {
      console.error('Error in symptom analysis:', err);
      throw new Error(`Failed to analyze symptoms: ${err.message}`);
    }
  }
}

module.exports = SymptomService;