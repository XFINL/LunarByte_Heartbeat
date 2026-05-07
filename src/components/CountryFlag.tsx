interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
}

const countryCodes: Record<string, string> = {
  'Iceland': 'is',
  'United States': 'us',
  'China': 'cn',
  'Japan': 'jp',
  'Germany': 'de',
  'United Kingdom': 'gb',
  'France': 'fr',
  'Canada': 'ca',
  'Australia': 'au',
  'Singapore': 'sg',
  'South Korea': 'kr',
  'Netherlands': 'nl',
  'Russia': 'ru',
  'Brazil': 'br',
  'India': 'in',
};

export default function CountryFlag({ countryCode, size = 'sm' }: CountryFlagProps) {
  const code = countryCodes[countryCode] || countryCode.toLowerCase();
  
  const widthMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <img
      src={`https://flagcdn.com/w${widthMap[size]}/${code}.png`}
      alt={countryCode}
      className="rounded-sm shadow-sm object-cover"
      loading="lazy"
    />
  );
}
