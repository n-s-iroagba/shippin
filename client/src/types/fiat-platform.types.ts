
export interface FiatPlatformAttributes {
  id: number;
  adminId: number;
  name: string;
  baseUrl: string;
  messageTemplate: string;
}

export interface CreateFiatPlatformDto {
  name: string;
  baseUrl: string;
  messageTemplate: string;
}

export type UpdateFiatPlatformDto = Partial<CreateFiatPlatformDto>;
