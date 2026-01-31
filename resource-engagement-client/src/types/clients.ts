export interface Client {
  id: number;
  name: string;
  email: string;
  contactName: string;
  contactPhone: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  contactName: string;
  contactPhone: string;
}

export interface UpdateClientRequest {
  name: string;
  email: string;
  contactName: string;
  contactPhone: string;
}
