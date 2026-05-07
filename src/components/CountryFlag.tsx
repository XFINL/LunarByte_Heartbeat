interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
}

const countryCodes: Record<string, string> = {
  'Iceland': 'IS',
  'United States': 'US',
  'China': 'CN',
  'Japan': 'JP',
  'Germany': 'DE',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Canada': 'CA',
  'Australia': 'AU',
  'Singapore': 'SG',
  'South Korea': 'KR',
  'Netherlands': 'NL',
  'Russia': 'RU',
  'Brazil': 'BR',
  'India': 'IN',
};

export default function CountryFlag({ countryCode, size = 'sm' }: CountryFlagProps) {
  const code = countryCodes[countryCode] || countryCode.toUpperCase();
  
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-6',
  };

  return (
    <img
      src={`https://flagcdn.com/${size === 'lg' ? '48' : size === 'md' ? '32' : '24'}/${code.toLowerCase()}.png`}
      alt={countryCode}
      className={`${sizeClasses[size]} rounded-sm shadow-sm object-cover`}
      loading="lazy"
    />
  );
}
