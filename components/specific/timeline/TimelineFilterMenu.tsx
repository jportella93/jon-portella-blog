import { useEffect, useRef } from "react";
import {
  getTimelineCategoryEmoji,
  getTimelineTypeEmoji,
  TimelineCategory,
} from "../../../lib/timelineData";
import { useTheme } from "../../ThemeProvider";

interface TimelineFilterMenuProps {
  isOpen: boolean;
  selectedTypes: Set<string>;
  selectedCategories: Set<string>;
  availableTypes: string[];
  availableCategories: TimelineCategory[];
  onUpdateFilters: (types: Set<string>, categories: Set<string>) => void;
  onClose: () => void;
}

export function TimelineFilterMenu({
  isOpen,
  selectedTypes,
  selectedCategories,
  availableTypes,
  availableCategories,
  onUpdateFilters,
  onClose,
}: TimelineFilterMenuProps) {
  const { isDarkMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const toggleType = (type: string) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    onUpdateFilters(newTypes, selectedCategories);
  };

  const toggleCategory = (category: TimelineCategory) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    onUpdateFilters(selectedTypes, newCategories);
  };

  // Helper function to format filter labels
  const formatFilterLabel = (
    value: string,
    getEmoji: (val: string) => string
  ) => {
    const emoji = getEmoji(value);
    const displayText =
      value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
    return emoji ? `${emoji} ${displayText}` : displayText;
  };

  // Create combined filter list (excluding "project" type since projects are filtered by category)
  const allFilters = [
    ...availableTypes.map((type) => ({
      id: `type-${type}`,
      value: type,
      label: formatFilterLabel(type, getTimelineTypeEmoji),
      isSelected: selectedTypes.has(type),
      isType: true as const,
    })),
    ...availableCategories.map((category) => ({
      id: `category-${category}`,
      value: category,
      label: formatFilterLabel(category, getTimelineCategoryEmoji),
      isSelected: selectedCategories.has(category),
      isType: false as const,
    })),
  ].sort((a, b) => {
    // Sort by text part only, ignoring emoji prefix
    const getTextPart = (label: string) =>
      label.substring(label.indexOf(" ") + 1);
    return getTextPart(a.label).localeCompare(getTextPart(b.label));
  });

  const toggleAll = () => {
    const allTypesSelected = availableTypes.every((type) =>
      selectedTypes.has(type)
    );
    const allCategoriesSelected = availableCategories.every((category) =>
      selectedCategories.has(category)
    );

    if (allTypesSelected && allCategoriesSelected) {
      // Deselect all
      onUpdateFilters(new Set(), new Set());
    } else {
      // Select all
      onUpdateFilters(new Set(availableTypes), new Set(availableCategories));
    }
  };

  const toggleFilter = (filter: (typeof allFilters)[0]) => {
    if (filter.isType) {
      toggleType(filter.value);
    } else {
      toggleCategory(filter.value as TimelineCategory);
    }
  };

  if (!isOpen) return null;

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    left: "50%",
    bottom: "90px", // Above the floating bar
    transform: "translateX(-50%)",
    zIndex: 101, // Above the floating bar (100)
    background: isDarkMode
      ? "rgba(26, 26, 26, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px) saturate(180%)",
    WebkitBackdropFilter: "blur(8px) saturate(180%)",
    borderRadius: "8px",
    padding: "16px",
    minWidth: "280px",
    maxWidth: "400px",
    maxHeight: "70vh",
    overflowY: "auto",
    boxShadow: isDarkMode
      ? "0 8px 32px rgba(0,0,0,0.5)"
      : "0 8px 32px rgba(0,0,0,0.2)",
    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 0",
    cursor: "pointer",
  };

  const checkboxStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: `2px solid ${isDarkMode ? "#555" : "#ddd"}`,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const checkedCheckboxStyle: React.CSSProperties = {
    ...checkboxStyle,
    background: isDarkMode ? "#5ba3d3" : "#358ccb",
    borderColor: isDarkMode ? "#5ba3d3" : "#358ccb",
  };

  const checkmarkStyle: React.CSSProperties = {
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
    flex: 1,
  };

  const toggleAllStyle: React.CSSProperties = {
    fontSize: "12px",
    color: isDarkMode ? "#5ba3d3" : "#358ccb",
    cursor: "pointer",
    marginBottom: "8px",
    textDecoration: "underline",
  };

  const allTypesSelected = availableTypes.every((type) =>
    selectedTypes.has(type)
  );
  const allCategoriesSelected = availableCategories.every((category) =>
    selectedCategories.has(category)
  );
  const allSelected = allTypesSelected && allCategoriesSelected;
  const toggleAllText = allSelected ? "Deselect All" : "Select All";

  return (
    <div ref={menuRef} style={menuStyle}>
      <div style={toggleAllStyle} onClick={toggleAll}>
        {toggleAllText}
      </div>
      {allFilters.map((filter) => (
        <div
          key={filter.id}
          style={checkboxContainerStyle}
          onClick={() => toggleFilter(filter)}
        >
          <div style={filter.isSelected ? checkedCheckboxStyle : checkboxStyle}>
            {filter.isSelected && <span style={checkmarkStyle}>✓</span>}
          </div>
          <span style={labelStyle}>{filter.label}</span>
        </div>
      ))}
    </div>
  );
}
