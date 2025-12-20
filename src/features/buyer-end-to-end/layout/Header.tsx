import React from 'react'
import Image from "next/image";

export const Header = () => {
  return (
         <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-blue-600">VISIBUY</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
            beta
          </span>
        </div>
        <Image src="/icons/Menu.svg" alt="Menu" width={28} height={28} />
      </div>
  )
}
