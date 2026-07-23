import React from 'react';
import * as Icons from 'lucide-react';

export default function CategoryIcon({ name, className = 'w-5 h-5', style }) {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} style={style} />;
}
