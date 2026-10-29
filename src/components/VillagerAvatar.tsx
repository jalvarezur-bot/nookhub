import React, { useState } from 'react';
import { Villager } from '../types';

interface VillagerAvatarProps {
  villager: Villager;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSpeciesBadge?: boolean;
}

export const VillagerAvatar: React.FC<VillagerAvatarProps> = ({
  villager,
  size = 'md',
  className = '',
  showSpeciesBadge = false
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-[10px]',
    md: 'w-10 h-10 rounded-xl text-xs',
    lg: 'w-12 h-12 rounded-xl text-sm',
    xl: 'w-14 h-14 rounded-2xl text-base'
  };

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center overflow-hidden font-bold text-white shadow-xs ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: villager.avatarColor || '#489D6C' }}
    >
      {villager.imageUrl && !imageError ? (
        <img
          src={villager.imageUrl}
          alt={villager.nameSpanish}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-0.5"
        />
      ) : (
        <span>{villager.nameSpanish.slice(0, 2)}</span>
      )}

      {showSpeciesBadge && (
        <span className="absolute bottom-0 right-0 text-[8px] bg-[#3C342C]/85 px-1 py-0.2 rounded-tl-sm text-white font-mono leading-none">
          {villager.speciesSpanish}
        </span>
      )}
    </div>
  );
};
