import React, { useEffect, useMemo, useState } from "react";
import { useGetAllUsersQuery } from "@/redux/api/apiSlice";
import PaginationComponent from "@/components/common/PaginationComponent";
import AdminUsersFilter from "@/features/admin/components/users/AdminUsersFilter";
import AdminUsersSkeleton from "@/components/feedback/loading/AdminUsersSkeleton";
import AdminUsersList from "@/features/admin/components/users/AdminUsersList";
import { useSearchParams } from "react-router-dom";
import ErrorState from "@/components/feedback/error/ErrorState";
import AdminEmptyState from "@/components/feedback/empty-state/AdminEmptyState";

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "All",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllUsersQuery(
    {
      page,
      limit: 8,
      role: roleFilter,
      search: debouncedSearch,
    },
  );

  const users = data?.users || [];

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", page.toString());
    }

    if (roleFilter !== "All") {
      params.set("role", roleFilter);
    }

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    setSearchParams(params, { replace: true });
  }, [page, roleFilter, debouncedSearch, setSearchParams]);

  const totalUsers = useMemo(() => {
    return data?.totalUsers || users.length;
  }, [data, users]);

  const hasFilters = debouncedSearch.trim() !== "" || roleFilter !== "All";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div
            className="
          h-[6px]
          w-[6px]
          rounded-full
          bg-black/80
        "
          />

          <p
            className="
          text-[10px]
          font-medium
          tracking-[0.18em]
          uppercase
          text-black/35
        "
          >
            Customer Management
          </p>
        </div>

        <h1
          className="
        mt-4
        text-[32px]
        leading-none
        font-semibold
        tracking-[-0.06em]
        text-black/90
      "
        >
          Users
        </h1>

        <p
          className="
        mt-3
        text-[13px]
        text-black/40
      "
        >
          Manage customer accounts and platform access
        </p>
      </div>

      <AdminUsersFilter
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <div
        className="
    overflow-hidden
    rounded-[28px]
    border border-black/[0.045]
    bg-white/[0.78]
    backdrop-blur-xl
    shadow-[0_20px_60px_rgba(0,0,0,0.04)]
  "
      >
        <div
          className="
      flex items-center justify-between
      border-b border-black/[0.045]
      px-6
      py-5
    "
        >
          <p
            className="
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35
      "
          >
            Platform Users
          </p>

          {!isLoading && !isError && (
            <p
              className="
          text-[12px]
          tracking-[0.01em]
          text-black/35
        "
            >
              {totalUsers} Users
            </p>
          )}
        </div>

        {isLoading || isFetching ? (
          <div className="divide-y divide-black/[0.045]">
            {Array.from({ length: 6 }).map((_, index) => (
              <AdminUsersSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            compact
            refetch={refetch}
            isFetching={isFetching}
            title={"Failed to load users"}
            description={
              "Something went wrong while loading the user directory. Please try again later."
            }
          />
        ) : users.length === 0 ? (
          <AdminEmptyState
            users
            compact
            hasFilters={hasFilters}
            filtersTitle={"No matching users"}
            filtersDescription={"Try adjusting your search or filters."}
            emptyTitle={"No users yet"}
            emptyDescription={
              "Customer accounts will appear here once people sign up."
            }
            setSearch={setSearch}
            setRoleFilter={setRoleFilter}
          />
        ) : (
          <div className="divide-y divide-black/[0.045]">
            {users?.map((user) => {
              return (
                <AdminUsersList
                  key={user._id}
                  user={user}
                  debouncedSearch={debouncedSearch}
                />
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && data?.totalPages > 1 && (
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={data?.totalPages || 1}
        />
      )}
    </div>
  );
};

export default AdminUsers;
