export interface SoilStats {
  moisture: number;
  ph: number;
  temp: number;
  npk?: string;
}

export interface MarketPrice {
  crop: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  market: string;
}

export const TAMIL_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur", 
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", 
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", 
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
  "Viluppuram", "Virudhunagar"
];

export const SOIL_TYPES = ["Red Soil", "Black Soil", "Alluvial Soil", "Sandy Soil", "Clayey Soil"];
export const SEASONS = ["Kharif (Sornavari/Kar/Kuruvai)", "Rabi (Samba/Thaladi/Pishanam)", "Zaid (Navarai)"];
export const WATER_LEVELS = ["High", "Moderate", "Low", "Rainfed Only"];
