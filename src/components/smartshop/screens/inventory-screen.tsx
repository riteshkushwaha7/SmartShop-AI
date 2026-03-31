import { FormEvent } from "react";
import { AppButton, EmptyState, LoadingState, Pill, StockBadge, SurfaceCard } from "@/components/smartshop/ui";
import { formatCurrency, stockStatus } from "@/lib/prototype-utils";
import { Product } from "@/types/prototype";

export interface ProductFormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  imageHint: string;
}

interface InventoryScreenProps {
  products: Product[];
  productForm: ProductFormState;
  editingProductId: string | null;
  busy: boolean;
  lowStockCount: number;
  outOfStockCount: number;
  onFormChange: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onNext: () => void;
}

export function InventoryScreen({
  products,
  productForm,
  editingProductId,
  busy,
  lowStockCount,
  outOfStockCount,
  onFormChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  onNext,
}: InventoryScreenProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr] animate-fade-in">
      <SurfaceCard title={editingProductId ? "Edit Product" : "Add Product"} subtitle="Create and maintain inventory entries">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm text-[#3a5283]">
            Product name
            <input
              className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={productForm.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              placeholder="Samosa"
            />
          </label>

          <label className="block text-sm text-[#3a5283]">
            Category
            <input
              className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={productForm.category}
              onChange={(event) => onFormChange("category", event.target.value)}
              placeholder="Snacks"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[#3a5283]">
              Price
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
                value={productForm.price}
                onChange={(event) => onFormChange("price", event.target.value)}
                placeholder="20"
              />
            </label>
            <label className="block text-sm text-[#3a5283]">
              Available stock
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
                value={productForm.stock}
                onChange={(event) => onFormChange("stock", event.target.value)}
                placeholder="30"
              />
            </label>
          </div>

          <label className="block text-sm text-[#3a5283]">
            Product image placeholder
            <input
              className="mt-1 w-full rounded-2xl border border-[#d6e3ff] bg-[#f9fbff] px-3 py-2 outline-none ring-[#70a4ff] focus:ring"
              value={productForm.imageHint}
              onChange={(event) => onFormChange("imageHint", event.target.value)}
              placeholder="Crispy snack photo"
            />
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <AppButton type="submit" disabled={busy}>
              {busy ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
            </AppButton>
            {editingProductId && (
              <AppButton type="button" variant="secondary" onClick={onCancelEdit}>
                Cancel Edit
              </AppButton>
            )}
          </div>
        </form>

        {busy && (
          <div className="mt-4">
            <LoadingState text="Updating inventory records..." />
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard title="Inventory Table" subtitle="Stock status, pricing, and quick actions">
        {products.length === 0 ? (
          <EmptyState
            title="No products added"
            message="Start by adding products so SmartShop AI can validate inventory during chat orders."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[#5f749d]">
                <tr>
                  <th className="pb-2 pr-3">Product</th>
                  <th className="pb-2 pr-3">Category</th>
                  <th className="pb-2 pr-3">Price</th>
                  <th className="pb-2 pr-3">Stock</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6eefc]">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-[#223f74]">{product.name}</p>
                      <p className="text-xs text-[#667aa2]">{product.imageHint}</p>
                    </td>
                    <td className="py-3 pr-3 text-[#4b6292]">{product.category}</td>
                    <td className="py-3 pr-3 text-[#244276]">{formatCurrency(product.price)}</td>
                    <td className="py-3 pr-3 text-[#244276]">{product.stock}</td>
                    <td className="py-3 pr-3">
                      <StockBadge status={stockStatus(product.stock)} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <AppButton variant="ghost" onClick={() => onEdit(product)}>Edit</AppButton>
                        <AppButton variant="ghost" onClick={() => onDelete(product.id)}>Delete</AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <AppButton variant="secondary" onClick={onNext}>Next: Customer Discovery</AppButton>
          <Pill tone={lowStockCount > 0 ? "warning" : "success"}>{lowStockCount} low stock alerts</Pill>
          <Pill tone={outOfStockCount > 0 ? "danger" : "default"}>{outOfStockCount} out of stock</Pill>
        </div>
      </SurfaceCard>
    </div>
  );
}
