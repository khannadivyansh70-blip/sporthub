export const sportImages: Record<string, string> = {
  Football: "/hero-football.jpeg",

  Basketball:
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=85",

  Cricket: "/hero-cricket.jpeg",

  Badminton: "/hero-badminton.jpeg",

  Running:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=85",

  Fitness:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85",

  Esports:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
};

export function getSportImage(sport: string) {
  return (
    sportImages[sport] ??
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=85"
  );
}