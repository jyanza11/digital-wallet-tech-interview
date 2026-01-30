import { Loader2Icon } from 'lucide-react'
import React from 'react'

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="size-4 animate-spin" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
