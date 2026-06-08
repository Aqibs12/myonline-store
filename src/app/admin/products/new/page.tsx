import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Add a new product</h2>
      <ProductForm />
    </div>
  );
}
