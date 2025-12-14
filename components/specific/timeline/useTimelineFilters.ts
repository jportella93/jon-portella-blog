import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type TimelineCategory,
  type TimelineItem,
  type TimelineMainItem,
  timelineDataNested,
} from "../../../lib/timelineData";

export function useTimelineFilters() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const isInitialLoad = useRef(true);

  // Helper function to get all available nested item types (profile-picture, blog-post, milestone)
  const getAllAvailableTypes = useMemo(() => {
    const types = new Set<string>();
    timelineDataNested.forEach((item) => {
      if ((item.type === "study" || item.type === "job") && item.projects) {
        item.projects.forEach((project) => {
          if (project.type !== "project") {
            types.add(project.type);
          }
        });
      }
    });
    return Array.from(types).sort();
  }, []);

  // Helper function to get all available categories from project items (excluding "writing")
  const getAllAvailableCategories = useMemo(() => {
    const categories = new Set<TimelineCategory>();
    timelineDataNested.forEach((item) => {
      if ((item.type === "study" || item.type === "job") && item.projects) {
        item.projects.forEach((project) => {
          if (project.category && project.category !== "writing") {
            categories.add(project.category);
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, []);

  // Initialize filters from URL on mount
  useEffect(() => {
    const { types: typesParam, categories: categoriesParam } = router.query;

    const hasExplicitParams =
      typesParam !== undefined || categoriesParam !== undefined;

    const parsedTypes = typesParam
      ? new Set<string>(
          (typesParam as string)
            .split(",")
            .filter((type) => getAllAvailableTypes.includes(type))
        )
      : isInitialLoad.current || !hasExplicitParams
        ? new Set<string>(getAllAvailableTypes)
        : new Set<string>(); // Empty set if no types param and not initial load

    const parsedCategories = categoriesParam
      ? new Set<string>(
          (categoriesParam as string)
            .split(",")
            .filter((cat) =>
              getAllAvailableCategories.includes(cat as TimelineCategory)
            )
        )
      : isInitialLoad.current || !hasExplicitParams
        ? new Set<string>(getAllAvailableCategories)
        : new Set<string>(); // Empty set if no categories param and not initial load

    setSelectedTypes(parsedTypes);
    setSelectedCategories(parsedCategories);

    // Mark that initial load is complete after first run
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [router.query, getAllAvailableTypes, getAllAvailableCategories]);

  // Update URL when filters change
  const updateFilters = (newTypes: Set<string>, newCategories: Set<string>) => {
    setSelectedTypes(newTypes);
    setSelectedCategories(newCategories);

    const params = new URLSearchParams();

    // Only add params if not all items are selected (clean URL when everything is selected)
    if (newTypes.size !== getAllAvailableTypes.length) {
      params.set("types", Array.from(newTypes).join(","));
    }
    if (newCategories.size !== getAllAvailableCategories.length) {
      params.set("categories", Array.from(newCategories).join(","));
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : router.pathname;
    router.push(newUrl, undefined, { shallow: true });
  };

  // Helper function to check if an item should be shown based on filters
  const shouldShowItem = (item: TimelineItem): boolean => {
    // Main study/job items are always visible
    if (item.type === "study" || item.type === "job") {
      return true;
    }

    // For project items, filter by category
    if (item.type === "project") {
      return item.category ? selectedCategories.has(item.category) : false;
    }

    // For other nested items (profile-picture, blog-post, milestone), filter by type
    return selectedTypes.has(item.type);
  };

  // Helper function to check if a main item should be shown (main items are always shown)
  const shouldShowMainItem = (item: TimelineMainItem): boolean => {
    // Main study/job items are always shown
    return true;
  };

  // Check if any filters are active (not all nested item types/categories selected)
  const hasActiveFilters =
    selectedTypes.size !== getAllAvailableTypes.length ||
    selectedCategories.size !== getAllAvailableCategories.length;

  return {
    // State
    selectedTypes,
    selectedCategories,
    isFilterMenuOpen,
    setIsFilterMenuOpen,

    // Available options
    getAllAvailableTypes,
    getAllAvailableCategories,

    // Filter functions
    shouldShowItem,
    shouldShowMainItem,

    // Actions
    updateFilters,

    // Computed values
    hasActiveFilters,
  };
}
