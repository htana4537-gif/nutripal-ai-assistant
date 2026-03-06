
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WeeklyPlan, Attachment, NutrientDeficiency, Meal, Exercise, LabelAnalysis, Message } from "../types";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const getSystemInstruction = (profile: UserProfile): string => {
  // Extract high preference foods (score > 6)
  const preferredFoods = profile.foodDatabase
    .filter(f => f.preference >= 7 && f.isAvailable)
    .map(f => `${f.name} (Preference: ${f.preference}/10)`)
    .slice(0, 50)
    .join(", ");
    
  // Extract budget info
  const budgetInfo = profile.foodDatabase
    .filter(f => f.isAvailable)
    .map(f => `${f.name}: ${profile.currency} ${f.price}/${f.unit}`)
    .slice(0, 50) 
    .join(", ");

  const deficiencies = profile.deficiencies?.map(d => d.nutrient).join(", ") || "None";

  const langMap = {
      'en': 'English',
      'ar': 'Arabic',
      'fr': 'French',
      'es': 'Spanish'
  };
  const langName = (langMap as any)[profile.language] || 'English';
  
  // Special Mode Instructions
  let specialModeInstructions = "";
  if (profile.specialMode === 'DamageControl') {
      specialModeInstructions = "CRITICAL: The user is in 'Damage Control Mode' (just overate). Focus plans and advice on CALORIE DEFICIT, LOWER CARBS, and HIGH PROTEIN to balance the recent excess. Suggest higher intensity cardio. Be forgiving but disciplined.";
  } else if (profile.specialMode === 'Travel') {
      specialModeInstructions = "CRITICAL: The user is in 'Travel Mode'. Focus advice on HYDRATION, avoiding caffeine in evenings, and light meals to adjust circadian rhythm (Jet Lag).";
  } else if (profile.activityLevel === 'Sedentary') {
      specialModeInstructions = "User is 'Sedentary'. Suggest meals that prevent 'post-lunch slump' (lower glycemic index). Frequently remind them to perform desk stretches.";
  }

  return `
    You are AI GYM, an elite Personal Trainer, Nutritionist, and Psychological Support Companion.
    Your client is ${profile.name}, ${profile.age} years old, ${profile.height}cm, ${profile.weight}kg.
    Location: ${profile.country}.
    Goal: ${profile.goal}. Activity: ${profile.activityLevel}.
    Budget Mode: ${profile.budgetMode ? "ENABLED (Suggest low-cost, accessible ingredients)" : "Standard"}.
    Dietary Restrictions: ${profile.dietaryRestrictions.join(", ") || "None"}.
    Known Nutrient Deficiencies: ${deficiencies}.
    
    ${specialModeInstructions}
    
    *** CRITICAL LANGUAGE INSTRUCTION ***
    User Language: ${langName}.
    You MUST output ALL text content (plans, recipes, chat responses, exercise names, instructions) in **${langName}**.
    
    Currency: Use ${profile.currency} for any pricing.
    User's AVAILABLE High Preference Foods: ${preferredFoods || "No specific preferences set yet."}
    
    === PSYCHOLOGICAL & SENTIMENT PROTOCOL ===
    1. **Analyze Sentiment**: In every interaction, assess the user's emotional state (Stressed, Anxious, Guilt-ridden, Motivated, Happy).
    2. **Adjust Tone**:
       - If Stressed/Anxious: Switch to a **Calm, Reassuring, and Empathetic** tone. Use softer language.
       - If Motivated: Be **High Energy, Encouraging, and Challenging**.
       - If Guilt-ridden (e.g., "I ate pizza"): **De-escalate immediately**. Do not judge. Frame it as "data," not "failure". Use the "Damage Control" logic.
    3. **Emotional Eating Support**:
       - If the user indicates urges to binge or eat due to emotions, **DO NOT** just say "don't do it".
       - Suggest **Grounding Techniques** (e.g., "Take 3 deep breaths," "Drink a glass of water and wait 5 mins," "Step outside").
       - Suggest "Dopamine-replacement" activities (short walk, music, stretching) instead of food.
    
    Capabilities:
    1. Analyze food images for calories/macros.
    2. Create detailed workout plans.
    3. Create diet plans with MULTIPLE OPTIONS per meal using ONLY the user's available foods.
    4. Provide recipes with cooking steps.
    5. Track progress.
    6. Analyze symptoms to suggest potential vitamin/mineral deficiencies.
    7. Analyze free-text food logs to estimate calories and macros.
    
    Always be concise unless asked for detailed explanations. Use emojis to be friendly and visual.
  `;
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  profile: UserProfile,
  attachment?: Attachment
): Promise<string> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash"; 

  const systemInstruction = getSystemInstruction(profile);

  try {
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction,
      },
      history: history.filter(h => h.role !== 'user' || !h.attachment).map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const parts: any[] = [{ text: newMessage }];
    
    if (attachment) {
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data
        }
      });
    }

    const result = await chat.sendMessage({
      message: parts
    });

    return result.text || "I'm having trouble thinking right now. Let's try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I encountered a connection error. Please check your API key.";
  }
};

export const generateWeeklyPlan = async (profile: UserProfile): Promise<WeeklyPlan | null> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash";

  let favoritesContext = "";
  if (profile.favoriteMeals.length > 0) {
    favoritesContext += `\nUser's Saved Favorite Meals: ${profile.favoriteMeals.map(m => m.name).join(', ')}.`;
  }
  if (profile.favoriteWorkouts.length > 0) {
    favoritesContext += `\nUser's Saved Favorite Workouts: ${profile.favoriteWorkouts.map(w => w.focus).join(', ')}.`;
  }
  
  const availableFoods = profile.foodDatabase
    .filter(f => f.isAvailable)
    .sort((a, b) => b.preference - a.preference) 
    .map(f => `${f.name}`)
    .join(", ");

  const langMap = {
      'en': 'English',
      'ar': 'Arabic',
      'fr': 'French',
      'es': 'Spanish'
  };
  const langName = (langMap as any)[profile.language] || 'English';
  
  // Specific instruction based on mode
  let modeInstruction = "";
  if (profile.specialMode === 'DamageControl') {
      modeInstruction = "MODE: DAMAGE CONTROL. Reduce carbohydrate intake significantly. Increase protein and veggies. Focus workout on Calorie Burning (Cardio/HIIT).";
  } else if (profile.specialMode === 'Travel') {
      modeInstruction = "MODE: TRAVEL/JET LAG. Prioritize hydration and light meals. Ensure adequate protein.";
  }

  const prompt = `
    Create a 1-day detailed Diet and Workout plan for ${profile.name}.
    Goal: ${profile.goal}.
    Location: ${profile.country}.
    Budget Mode: ${profile.budgetMode}.
    Dietary Restrictions: ${profile.dietaryRestrictions.join(',')}.
    Target Language: ${langName}.
    
    ${modeInstruction}
    
    CRITICAL INSTRUCTION: You MUST construct the diet plan using ONLY the ingredients listed below.
    AVAILABLE FOODS INVENTORY: ${availableFoods || "Suggest general healthy foods."}
    
    IMPORTANT CONFIGURATION:
    1. **Breakfast, Lunch, Dinner, Snack**: Provide **1 OPTION** ONLY to save space.
    
    STRICT OPTIMIZATION RULES:
    - **Language**: ALL content values (names, descriptions, ingredients, exercises) MUST be in **${langName}**. The JSON keys must remain in English.
    - **Descriptions**: Keep extremely concise (Max 5 words).
    - **Ingredients**: List ONLY the main 3-5 ingredients per meal.
    - **Steps/Instructions**: OMIT.
    - **Formatting**: Return raw JSON only. NO Markdown.
  `;

  const IngredientSchema = {type: Type.OBJECT, properties: {item: {type: Type.STRING}, amount: {type: Type.STRING}}};
  
  const MealSchema = { 
      type: Type.OBJECT,
      properties: { 
          name: {type: Type.STRING}, 
          calories: {type: Type.NUMBER}, 
          protein: {type: Type.NUMBER}, 
          carbs: {type: Type.NUMBER}, 
          fats: {type: Type.NUMBER}, 
          ingredients: {type: Type.ARRAY, items: IngredientSchema},
          description: {type: Type.STRING},
      }
  };

  const ExerciseSchema = {
      type: Type.OBJECT,
      properties: {
          name: {type: Type.STRING},
          sets: {type: Type.NUMBER},
          reps: {type: Type.STRING},
          notes: {type: Type.STRING},
      }
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      generatedAt: { type: Type.NUMBER },
      days: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            meals: {
              type: Type.OBJECT,
              properties: {
                breakfast: { type: Type.ARRAY, items: MealSchema },
                lunch: { type: Type.ARRAY, items: MealSchema },
                dinner: { type: Type.ARRAY, items: MealSchema },
                snack: { type: Type.ARRAY, items: MealSchema },
              }
            },
            workout: {
                type: Type.OBJECT,
                properties: {
                    focus: {type: Type.STRING},
                    durationMin: {type: Type.NUMBER},
                    exercises: {
                        type: Type.ARRAY,
                        items: ExerciseSchema
                    }
                }
            }
          }
        }
      }
    }
  };

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: getSystemInstruction(profile)
      }
    });

    if (result.text) {
      let cleanText = result.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return JSON.parse(cleanText) as WeeklyPlan;
    }
    return null;
  } catch (error) {
    console.error("Plan Gen Error:", error);
    return null;
  }
};

export const getMealRecipe = async (mealName: string, ingredients: string, profile: UserProfile): Promise<Partial<Meal> | null> => {
    const ai = getClient();
    const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
    const lang = (langMap as any)[profile.language] || 'English';

    const prompt = `
        Recipe for: ${mealName}.
        Base Ingredients: ${ingredients}.
        
        Provide detailed:
        1. Full Ingredient list with measurements.
        2. Cooking Steps (Max 5).
        3. Prep Time & Cooking Time.
        4. Chef Tip.
        
        OUTPUT LANGUAGE: **${lang}**.
    `;
    
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            ingredients: { type: Type.ARRAY, items: {type: Type.OBJECT, properties: {item: {type: Type.STRING}, amount: {type: Type.STRING}}} },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            prepTime: { type: Type.STRING },
            cookingTime: { type: Type.STRING },
            tips: { type: Type.STRING }
        }
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) return JSON.parse(result.text);
        return null;
    } catch (e) { return null; }
};

export const getExerciseDetails = async (exerciseName: string, profile: UserProfile): Promise<Partial<Exercise> | null> => {
    const ai = getClient();
    const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
    const lang = (langMap as any)[profile.language] || 'English';
    
    const prompt = `
        Provide details for exercise: ${exerciseName}.
        OUTPUT LANGUAGE: **${lang}**.
    `;

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefits: { type: Type.STRING }
        }
    };
    
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) return JSON.parse(result.text);
        return null;
    } catch (e) { return null; }
};

export const analyzeSymptoms = async (symptoms: string, profile: UserProfile): Promise<NutrientDeficiency[] | null> => {
    const ai = getClient();
    const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
    const lang = (langMap as any)[profile.language] || 'English';
    
    const prompt = `
        User Symptoms: ${symptoms}.
        Analyze for potential vitamin/mineral deficiencies.
        OUTPUT LANGUAGE: **${lang}**.
    `;
    
    const schema: Schema = {
        type: Type.ARRAY,
        items: {
             type: Type.OBJECT,
             properties: {
                 nutrient: {type: Type.STRING},
                 symptoms: {type: Type.STRING},
                 detectedAt: {type: Type.NUMBER}
             }
        }
    };
    
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) {
             const data = JSON.parse(result.text);
             return data.map((d: any) => ({ ...d, detectedAt: Date.now() }));
        }
        return null;
    } catch (e) { return null; }
};

export const analyzeFoodLog = async (text: string, profile: UserProfile): Promise<Meal | null> => {
    const ai = getClient();
    const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
    const lang = (langMap as any)[profile.language] || 'English';

    const prompt = `
        Analyze this food log: "${text}".
        Estimate calories and macros.
        If it's a beverage (coffee, tea), account for any mentioned sugar or milk.
        OUTPUT LANGUAGE: **${lang}** (for name/description).
    `;
    
    const schema: Schema = {
         type: Type.OBJECT,
         properties: { 
            name: {type: Type.STRING}, 
            calories: {type: Type.NUMBER}, 
            protein: {type: Type.NUMBER}, 
            carbs: {type: Type.NUMBER}, 
            fats: {type: Type.NUMBER}, 
            ingredients: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {item: {type: Type.STRING}, amount: {type: Type.STRING}}}},
            description: {type: Type.STRING},
            steps: {type: Type.ARRAY, items: {type: Type.STRING}} // Empty init
        }
    };
    
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) {
            const data = JSON.parse(result.text);
            return { ...data, steps: [], prepTime: '0', cookingTime: '0', tips: '' };
        }
        return null;
    } catch (e) { return null; }
};

export const analyzeActivityLog = async (activity: string, duration: string, profile: UserProfile): Promise<{name: string, calories: number} | null> => {
    const ai = getClient();
    const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
    const lang = (langMap as any)[profile.language] || 'English';

    const prompt = `
        User Stats: Weight ${profile.weight}kg, Gender ${profile.gender}.
        Activity: ${activity}.
        Duration: ${duration} minutes.
        
        Calculate estimated calories burned.
        OUTPUT LANGUAGE: **${lang}** (for name).
    `;

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            name: {type: Type.STRING},
            calories: {type: Type.NUMBER}
        }
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) return JSON.parse(result.text);
        return null;
    } catch (e) { return null; }
};

export const analyzeNutritionLabel = async (base64Image: string, profile: UserProfile): Promise<LabelAnalysis | null> => {
     const ai = getClient();
     const langMap = {'en':'English', 'ar':'Arabic', 'fr':'French', 'es':'Spanish'};
     const lang = (langMap as any)[profile.language] || 'English';
     
     const prompt = `
        Analyze this nutrition label/ingredients list image.
        Identify harmful ingredients (E-numbers, hydrogenated oils, high fructose syrup).
        Detect misleading marketing claims vs reality.
        Give a health score (0-10).
        OUTPUT LANGUAGE: **${lang}**.
     `;
     
     const schema: Schema = {
         type: Type.OBJECT,
         properties: {
             score: {type: Type.NUMBER},
             verdict: {type: Type.STRING, enum: ['Safe', 'Caution', 'Avoid']},
             summary: {type: Type.STRING},
             harmfulIngredients: {
                 type: Type.ARRAY,
                 items: {
                     type: Type.OBJECT,
                     properties: {
                         name: {type: Type.STRING},
                         riskLevel: {type: Type.STRING, enum: ['High', 'Medium', 'Low']},
                         description: {type: Type.STRING}
                     }
                 }
             },
             marketingAnalysis: {
                 type: Type.ARRAY,
                 items: {
                     type: Type.OBJECT,
                     properties: {
                         claim: {type: Type.STRING},
                         reality: {type: Type.STRING}
                     }
                 }
             }
         }
     };

     try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: base64Image } },
                    { text: prompt }
                ]
            },
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        if(result.text) return JSON.parse(result.text);
        return null;
    } catch (e) { return null; }
};

export const estimateLocalFoodPrices = async (
    foodNames: string[], 
    country: string, 
    currency: string
): Promise<Record<string, number> | null> => {
    const ai = getClient();
    const subset = foodNames.slice(0, 100); 

    const prompt = `
        Estimate or search for average market prices for these foods in **${country}** on a different websites or resources using currency **${currency}**.
        Items: ${subset.join(', ')}
        Return JSON array of {name, price}.
    `;

    const arraySchema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER }
            }
        }
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: arraySchema
            }
        });

        if (result.text) {
            const data = JSON.parse(result.text) as { name: string, price: number }[];
            const priceMap: Record<string, number> = {};
            data.forEach(item => {
                priceMap[item.name] = item.price;
            });
            return priceMap;
        }
        return null;
    } catch (e) {
        console.error("Price Estimation Error:", e);
        return null;
    }
};
