export const en = {
  app: {
    name: "FitNess",
    systemName: "FitNess OS",
    tagline: "Your body. Your data.",
  },

  auth: {
    welcomeBack: "Welcome back",
    description: "Sign in to continue your progress.",
    username: "Username",
    usernamePlaceholder: "Enter your username",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    login: "Login",
    authenticating: "Authenticating...",
    invalidCredentials: "Invalid username or password",
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
  },

  navigation: {
    dashboard: "Dashboard",
  },

  dashboard: {
    welcomeBack: "Welcome back",
    nutritionProgress: "Here's your nutrition progress for today.",
    dailyIntake: "Daily intake",
    todaysNutrition: "Today's nutrition",
    goal: "Goal",
    currentBodyWeight: "Current body weight",
    today: "Today",
  },

  macros: {
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    of: "of",
  },

  meals: {
    breakfast: "Breakfast",
    lunch: "Lunch",
    snack: "Snack",
    dinner: "Dinner",
  },

  goals: {
    loseWeight: "Lose weight",
    gainMuscle: "Gain muscle",
    maintainWeight: "Maintain weight",
    unknown: "Not defined",
  },

  preferences: {
    title: "Preferences",
    language: "Language",
    theme: "Theme",
    spanish: "Spanish",
    english: "English",
    system: "System",
    light: "Light",
    dark: "Dark",
  },

  account: {
    signedInAs: "Signed in as",
    logout: "Log out",
  },

  common: {
    units: {
      calories: "kcal",
      grams: "g",
      kilograms: "kg",
    },
    loading: "Loading FitNess...",
  },
} as const;
