export const PAKISTAN_PROVINCES = [
  "Islamabad Capital Territory",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir"
] as const;

export type PakistanProvince = typeof PAKISTAN_PROVINCES[number];

export const PAKISTAN_CITIES_BY_PROVINCE: Record<string, string[]> = {
  "Islamabad Capital Territory": [
    "Islamabad"
  ],
  "Punjab": [
    "Attock",
    "Bahawalnagar",
    "Bahawalpur",
    "Bhakkar",
    "Bhalwal",
    "Burewala",
    "Chakwal",
    "Chiniot",
    "Dera Ghazi Khan",
    "Faisalabad",
    "Gujranwala",
    "Gujrat",
    "Hafizabad",
    "Haroonabad",
    "Hasilpur",
    "Jhang",
    "Jhelum",
    "Kamoke",
    "Kasur",
    "Khanewal",
    "Khanpur",
    "Lahore",
    "Lalamusa",
    "Layyah",
    "Liaquatpur",
    "Mandi Bahauddin",
    "Mian Channu",
    "Mianwali",
    "Multan",
    "Muridke",
    "Murree",
    "Muzaffargarh",
    "Narowal",
    "Okara",
    "Pakpattan",
    "Pattoki",
    "Rahim Yar Khan",
    "Rawalpindi",
    "Sadiqabad",
    "Sahiwal",
    "Sambrial",
    "Samundri",
    "Sargodha",
    "Sheikhupura",
    "Sialkot",
    "Taxila",
    "Toba Tek Singh",
    "Vehari",
    "Wah Cantt",
    "Wazirabad"
  ],
  "Sindh": [
    "Badin",
    "Dadu",
    "Ghotki",
    "Hyderabad",
    "Jacobabad",
    "Jamshoro",
    "Karachi",
    "Kashmore",
    "Khairpur",
    "Kotri",
    "Larkana",
    "Matli",
    "Mirpur Khas",
    "Nawabshah (Shaheed Benazirabad)",
    "Nowshero Feroze",
    "Sanghar",
    "Sehwan",
    "Shikarpur",
    "Sukkur",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Muhammad Khan",
    "Thatta",
    "Umerkot"
  ],
  "Khyber Pakhtunkhwa": [
    "Abbottabad",
    "Bannu",
    "Batkhela",
    "Buner",
    "Charsadda",
    "Chitral",
    "Dera Ismail Khan",
    "Dir",
    "Hangu",
    "Haripur",
    "Karak",
    "Kohat",
    "Lakki Marwat",
    "Mansehra",
    "Mardan",
    "Mingora (Swat)",
    "Nowshera",
    "Parachinar",
    "Peshawar",
    "Swabi",
    "Tank",
    "Timergara"
  ],
  "Balochistan": [
    "Chaman",
    "Dera Allah Yar",
    "Dera Murad Jamali",
    "Gwadar",
    "Hub",
    "Kalat",
    "Kharan",
    "Khuzdar",
    "Loralai",
    "Nushki",
    "Ormara",
    "Pasni",
    "Pishin",
    "Quetta",
    "Sibi",
    "Turbat (Kech)",
    "Usta Mohammad",
    "Zhob"
  ],
  "Gilgit-Baltistan": [
    "Aliabad (Hunza)",
    "Astore",
    "Chilas",
    "Gahkuch",
    "Gilgit",
    "Khaplu",
    "Nagar",
    "Skardu"
  ],
  "Azad Jammu & Kashmir": [
    "Athmuqam",
    "Bagh",
    "Bhimber",
    "Hajira",
    "Kotli",
    "Mirpur",
    "Muzaffarabad",
    "Pallandri",
    "Rawalakot"
  ]
};

// Flattened & deduplicated sorted array of all cities across Pakistan
export const ALL_PAKISTAN_CITIES: string[] = Array.from(
  new Set(Object.values(PAKISTAN_CITIES_BY_PROVINCE).flat())
).sort((a, b) => a.localeCompare(b));

export function getCitiesForProvince(provinceName?: string): string[] {
  if (!provinceName) return ALL_PAKISTAN_CITIES;
  
  // Normalized lookup
  const norm = provinceName.trim().toLowerCase();
  for (const [p, cities] of Object.entries(PAKISTAN_CITIES_BY_PROVINCE)) {
    if (
      p.toLowerCase() === norm ||
      (norm.includes("islamabad") && p.includes("Islamabad")) ||
      (norm === "kpk" && p.includes("Khyber")) ||
      (norm === "ajk" && p.includes("Azad"))
    ) {
      return cities;
    }
  }

  return ALL_PAKISTAN_CITIES;
}

export function getProvinceForCity(cityName?: string): string | undefined {
  if (!cityName) return undefined;
  const norm = cityName.trim().toLowerCase();
  
  for (const [province, cities] of Object.entries(PAKISTAN_CITIES_BY_PROVINCE)) {
    if (cities.some((c) => c.toLowerCase() === norm)) {
      return province;
    }
  }
  return undefined;
}
