"use client"

import {
  PencilSquareIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline"
import { SocialMedia } from "@/types/social-media.types"
import { Dispatch, SetStateAction } from "react"

interface SocialMediaCardProps {
  socialMedia: SocialMedia
  onEdit: Dispatch<SetStateAction<SocialMedia | null>>
  onDelete: Dispatch<SetStateAction<SocialMedia | null>>
}

export const AdminSocialMediaCard = ({ socialMedia, onEdit, onDelete }: SocialMediaCardProps) => {


 

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-100 transition-all relative group">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
   

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 truncate">{socialMedia.name}</h3>
            <a
              href={socialMedia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-sm hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span className="truncate">{socialMedia.url}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={()=>onEdit(socialMedia)}
            className="p-2 text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
            aria-label="Edit social media"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={()=>onDelete(socialMedia)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete social media"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}