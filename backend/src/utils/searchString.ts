const searchString = (search: string) => {
  const newSearchString = new RegExp(
    search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i",
  );
  return newSearchString;
};

export default searchString;
