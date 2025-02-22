import { IProduct } from "@/models/Product.model";
import { IUser } from "@/models/User.model";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  headers?: Record<string, string>;
};
export type ProductFormData = Omit<IProduct, "_id">;
export type registerFormData = Omit<IUser, "_id">;
class ApiClient {

    private async fetch<T>(endpoint: string,options: FetchOptions = {}): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return response.json();
    }

    async registerUser(formData: registerFormData) {
        return this.fetch<registerFormData>("/auth/register", {
            method: "POST",
            body: formData,
        });
    }

    async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }
}

export const apiClient = new ApiClient();