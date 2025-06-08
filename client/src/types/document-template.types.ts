export interface DocumentTemplateAttributes {
  id: number;
  adminId: number;
  name: string;
  file: Buffer;
}

export interface CreateDocumentTemplateDto {
  name: string;
  file: File;
}

export interface UpdateDocumentTemplateDto {
  
  name?: string;
  file?: File;
}
