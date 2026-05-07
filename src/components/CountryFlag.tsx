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
  
  const sizeMap = {
    sm: 'w40',
    md: 'w80',
    lg: 'w160',
  };

  return (
    <img
      src={`https://flagcdn.asia/${sizeMap[size]}/${code}.png`}
      alt={countryCode}
      className={`rounded-sm shadow-sm object-cover`}
      loading="lazy"
    />
  );
}
