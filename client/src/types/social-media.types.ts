
export interface SocialMediaAttributes {
  id: number;
  adminId: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialMediaDto {
  name: string;
  url: string;
}

export interface UpdateSocialMediaDto extends Partial<CreateSocialMediaDto> {}
