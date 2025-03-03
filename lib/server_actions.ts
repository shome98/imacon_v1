import { IOrder } from "@/models/Order.model";
import { ImageVariant, IProduct } from "@/models/Product.model";
import { IUser } from "@/models/User.model";
import { Types } from "mongoose";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  headers?: Record<string, string>;
};
export type ProductFormData = Omit<IProduct, "_id">;
export type registerFormData = Omit<IUser, "_id">;
export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}
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
            cache:"no-store"
        },);

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

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number }>("/orders/checkout", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }

  async updateProduct(id: string, productData: ProductFormData) {
    return this.fetch<IProduct>(`/products/${id}`, {
      method: "PUT",
      body: productData,
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<{ message: string,}>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async deleteImage(fileId: string) {
    return this.fetch<{ message: string,status:number,error?:string }>("/imagekit/delete", {
      method: "POST",
      body:{fileId}
    })
  }
}

export const apiClient = new ApiClient();