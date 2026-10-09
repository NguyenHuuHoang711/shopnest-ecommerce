import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "@/features/admin/components/products/product-form/ProductForm";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/api/apiSlice";
import { toast } from "@/hooks/use-toast";
import ProductEditorSkeleton from "@/components/feedback/loading/ProductEditorSkeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";

const EditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data, isLoading, isError, refetch, isFetching } =
    useGetProductByIdQuery(id);

  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateProduct({
        id,
        data: formData,
      }).unwrap();

      toast({
        description: "Product updated",
      });

      navigate("/admin/products");
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Unable to edit product",
      });
    }
  };

  if (isLoading || isFetching) {
    return <ProductEditorSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load product"
        description="We couldn't load this product for editing. Please try again."
      />
    );
  }

  if (!data?.product) {
    return (
      <EmptyState
        title="Product not found"
        description="The product you're trying to edit doesn't exist or may have been removed."
        showAction
        actionText="Back to Products"
        onAction={() => navigate("/admin/products")}
      />
    );
  }

  return (
    <ProductForm
      initialData={data?.product}
      onSubmit={handleUpdate}
      loading={updating}
      buttonText="Save Changes"
    />
  );
};

export default EditProduct;
