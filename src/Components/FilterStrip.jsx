import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { FILTERS } from "../filters";

const FilterStrip = ({ selected, onSelect, imageUrl }) => {
  const scrollRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    const el = itemRefs.current[selected];
    if (el && scrollRef.current) {
      const strip = scrollRef.current;
      const elRect = el.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();
      if (elRect.left < stripRect.left || elRect.right > stripRect.right) {
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selected]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        gap: 1.25,
        overflowX: "auto",
        padding: "12px 16px",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {FILTERS.map((filter) => {
        const isSelected = selected === filter.id;
        return (
          <Box
            key={filter.id}
            ref={(el) => (itemRefs.current[filter.id] = el)}
            onClick={() => onSelect(filter.id)}
            sx={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              opacity: isSelected ? 1 : 0.7,
              transition: "opacity 0.2s, transform 0.2s",
              transform: isSelected ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1.5,
                overflow: "hidden",
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? "primary.main" : "divider",
                backgroundColor: "rgba(0,0,0,0.04)",
              }}
            >
              {imageUrl ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: filter.css,
                  }}
                />
              ) : null}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: isSelected ? "text.primary" : "text.secondary",
                fontWeight: isSelected ? 600 : 400,
                fontSize: 11,
                maxWidth: 70,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {filter.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default FilterStrip;
