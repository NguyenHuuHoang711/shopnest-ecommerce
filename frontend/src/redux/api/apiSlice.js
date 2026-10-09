import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL !== undefined) {
    return import.meta.env.VITE_API_URL;
  }
  return import.meta.env.DEV ? "http://localhost:3000" : "";
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const token = localStorage.getItem("token");

  if (
    token &&
    result.error?.status === 401 &&
    window.location.pathname !== "/auth"
  ) {
    localStorage.clear();

    sessionStorage.setItem(
      "authMessage",
      "Your session expired. Please sign in again.",
    );

    window.location.href = "/auth";
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Products",
    "Reviews",
    "Wishlist",
    "RecentlyViewed",
    "Address",
    "Payment",
    "Order",
    "Stats",
    "User",
    "Users",
    "Analytics",
  ],
  baseQuery: baseQueryWithAuth,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit, gender, category, sort, min, max, search }) => ({
        url: "/api/products",
        params: {
          page,
          limit,
          gender,
          category,
          sort,
          min,
          max,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Products",
                id: _id,
              })),
              { type: "Products", id: "LIST" },
              { type: "Products", id: "SEARCH" },
            ]
          : [
              { type: "Products", id: "LIST" },
              { type: "Products", id: "SEARCH" },
            ],
    }),

    getSearchSuggestions: builder.query({
      query: ({ search, gender, category, min, max }) => ({
        url: "/api/products/search-suggestions",
        params: {
          search,
          gender,
          category,
          min,
          max,
        },
      }),
      providesTags: [{ type: "Products", id: "SEARCH" }],
    }),

    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    getFeaturedProducts: builder.query({
      query: () => "/api/featured-products",
      providesTags: [{ type: "Products", id: "FEATURED" }],
    }),

    getRelatedProducts: builder.query({
      query: (id) => `/api/products/${id}/related`,
      providesTags: (result, error, id) => [
        { type: "Products", id },
        { type: "Products", id: `RELATED-${id}` },
      ],
    }),

    getReviews: builder.query({
      query: ({ productId, page, limit }) => ({
        url: `/api/products/${productId}/reviews`,
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
      ],
    }),
    getMyReviews: builder.query({
      query: () => "/api/products/reviews/my",
      providesTags: [{ type: "Reviews", id: "MY_REVIEWS" }],
    }),

    addReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `/api/products/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Reviews", id: "MY_REVIEWS" },
        { type: "Products", id: productId },
      ],
    }),

    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/api/products/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Reviews", id: "MY_REVIEWS" },
        { type: "Products", id: productId },
      ],
    }),

    contactMessage: builder.mutation({
      query: (data) => ({
        url: "/api/contact",
        method: "POST",
        body: data,
      }),
    }),

    subscribedUsers: builder.mutation({
      query: (data) => ({
        url: "/api/subscribe",
        method: "POST",
        body: data,
      }),
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/user/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [
        { type: "Stats", id: "DASHBOARD" },
        { type: "Users", id: "LIST" },
      ],
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (userData) => ({
        url: "/api/user/forgot-password",
        method: "POST",
        body: userData,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/api/user/reset-password/${token}`,
        method: "POST",
        body: {
          password,
          confirmPassword,
        },
      }),
    }),

    getProfile: builder.query({
      query: () => "/api/user/profile",
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/api/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/api/user/update-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    addRecentlyViewed: builder.mutation({
      query: (productId) => ({
        url: `/api/user/recently-viewed/${productId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "RecentlyViewed", id: "LIST" }],
    }),

    getRecentlyViewed: builder.query({
      query: () => "/api/user/recently-viewed",
      providesTags: [{ type: "RecentlyViewed", id: "LIST" }],
    }),

    wishlistApi: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    getWishlist: builder.query({
      query: () => "/api/wishlist",
      providesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    addShippingAddress: builder.mutation({
      query: (shippingData) => ({
        url: "/api/shipping/add",
        method: "POST",
        body: shippingData,
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    getUserAddresses: builder.query({
      query: () => "/api/shipping/my-addresses",
      providesTags: [{ type: "Address", id: "LIST" }],
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/api/shipping/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    addPaymentDetails: builder.mutation({
      query: (data) => ({
        url: "/api/payment/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),

    getPaymentDetails: builder.query({
      query: () => "/api/payment/saved",
      providesTags: [{ type: "Payment", id: "LIST" }],
    }),

    deletePaymentDetails: builder.mutation({
      query: (id) => ({
        url: `/api/payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),

    addOrderDetails: builder.mutation({
      query: (data) => ({
        url: "/api/orders/place",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Order", id: "LIST" },
        { type: "Order", id: "RECENT" },
        { type: "Stats", id: "DASHBOARD" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    getOrderDetails: builder.query({
      query: ({ page, limit }) => ({
        url: "/api/orders/my-orders",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order",
                id: _id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderById: builder.query({
      query: (id) => `/api/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/api/orders/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        { type: "Order", id: "RECENT" },
        { type: "Stats", id: "DASHBOARD" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    getAdminStats: builder.query({
      query: () => "/api/admin/stats",
      providesTags: [{ type: "Stats", id: "DASHBOARD" }],
    }),

    getRecentOrders: builder.query({
      query: () => "/api/admin/orders/recent",
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order",
                id: _id,
              })),
              { type: "Order", id: "RECENT" },
            ]
          : [{ type: "Order", id: "RECENT" }],
    }),

    getAdminOrders: builder.query({
      query: ({ page, limit, statusFilter, search }) => ({
        url: "/api/admin/orders",
        params: {
          page,
          limit,
          statusFilter,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order",
                id: _id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getAdminOrderDetails: builder.query({
      query: (id) => ({
        url: `/api/admin/orders/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: (data) => ({
        url: "/api/admin/orders/status-update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        { type: "Order", id: "RECENT" },
        { type: "Stats", id: "DASHBOARD" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    getAdminProducts: builder.query({
      query: ({ page, limit, gender, category, search }) => ({
        url: "/api/admin/products",
        params: {
          page,
          limit,
          gender,
          category,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Products",
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    deleteAdminProduct: builder.mutation({
      query: (id) => ({
        url: `/api/admin/products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "FEATURED" },
        { type: "Products", id: `RELATED-${id}` },
        { type: "Products", id: "SEARCH" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/api/admin/products/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Products", id: "LIST" },
        { type: "Products", id: "FEATURED" },
        { type: "Products", id: "SEARCH" },
        { type: "Stats", id: "DASHBOARD" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/admin/products/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "FEATURED" },
        { type: "Products", id: `RELATED-${id}` },
        { type: "Products", id: "SEARCH" },
        { type: "Analytics", id: "DASHBOARD" },
      ],
    }),

    getAllUsers: builder.query({
      query: ({ page, limit, role, search }) => ({
        url: "/api/admin/users",
        params: {
          page,
          limit,
          role,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({
                type: "Users",
                id: _id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getAdminUserDetails: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/api/admin/users/${id}`,
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Users", id }],
    }),

    getDashboardAnalytics: builder.query({
      query: () => "/api/admin/dashboard/analytics",
      providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSearchSuggestionsQuery,
  useGetFeaturedProductsQuery,
  useContactMessageMutation,
  useSubscribedUsersMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useAddShippingAddressMutation,
  useGetUserAddressesQuery,
  useDeleteAddressMutation,
  useAddOrderDetailsMutation,
  useAddPaymentDetailsMutation,
  useGetPaymentDetailsQuery,
  useDeletePaymentDetailsMutation,
  useGetOrderDetailsQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetReviewsQuery,
  useGetMyReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useWishlistApiMutation,
  useGetWishlistQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useAddRecentlyViewedMutation,
  useGetRecentlyViewedQuery,
  useGetAdminStatsQuery,
  useGetRecentOrdersQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useGetAdminProductsQuery,
  useDeleteAdminProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetAllUsersQuery,
  useGetAdminUserDetailsQuery,
  useGetDashboardAnalyticsQuery,
} = apiSlice;
