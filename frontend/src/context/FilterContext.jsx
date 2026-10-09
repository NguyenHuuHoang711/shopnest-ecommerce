import { createContext, useContext, useMemo, useState } from "react";

export const GENDERS = ["Men", "Women"];
export const CATEGORIES = ["T-shirt", "Hoodie", "Jacket", "Jeans", "Shoes"];

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [values, setValues] = useState([0, 500]);
  const [checked, setChecked] = useState(new Array(GENDERS.length).fill(false));
  const [checkedCategories, setCheckedCategories] = useState(
    new Array(CATEGORIES.length).fill(false),
  );
  const [sortBy, setSortBy] = useState("Recommended");

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,

      values,
      setValues,

      checked,
      setChecked,

      checkedCategories,
      setCheckedCategories,

      sortBy,
      setSortBy,
    }),
    [isOpen, values, checked, checkedCategories, sortBy],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
