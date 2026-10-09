import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/features/admin/components/products/product-form/ProductForm";
import { useCreateProductMutation } from "@/redux/api/apiSlice";
import { toast } from "@/hooks/use-toast";

const AddProduct = () => {
  const navigate = useNavigate();

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleCreate = async (data) => {
    try {
      await createProduct(data).unwrap();

      toast({
        description: "Product created",
      });

      navigate("/admin/products");
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Unable to create product",
      });
    }
  };

  return (
    <ProductForm
      onSubmit={handleCreate}
      loading={isLoading}
      buttonText="Create Product"
    />
  );
};

export default AddProduct;
