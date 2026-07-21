interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100';
  
  return (
    <div className={`${baseStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}