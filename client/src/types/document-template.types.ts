
export interface DocumentTemplateAttributes {
  id: number;
  adminId: number;
  name: string;
  filePath: string;
}

export interface CreateDocumentTemplateDto {
  name: string;
  file: File;
}

export interface UpdateDocumentTemplateDto {
  name?: string;
  file?: File;
}
