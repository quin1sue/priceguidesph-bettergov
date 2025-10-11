"use client";

import * as React from "react";
import { SquareChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropDownNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="border-blue-600/50 hover:bg-blue-600 hover:text-white border-[1px] bg-white text-black">
          BetterGov Projects <SquareChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="Budget Tracker">
            <a
              href="https://budget.bettergov.ph/2025/index.html"
              target="_blank"
            >
              Budget Tracker
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Petitions">
            <a href="https://petition.ph/" target="_blank">
              Petitions
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Tax Directory">
            <a
              href="https://taxdirectory.bettergov.ph/#/tax-calculators"
              target="_blank"
            >
              Tax Directory
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="SALN Tracker">
            <a href="https://saln.bettergov.ph/" target="_blank">
              SALN Tracker
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Hotlines">
            <a href="https://hotlines.bettergov.ph/" target="_blank">
              Hotlines
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Open Bayan">
            <a href="https://www.openbayan.org/" target="_blank">
              Open Bayan
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Open Congress API">
            <a href="https://open-congress-api.bettergov.ph/" target="_blank">
              Open Congress API
            </a>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Open Gov Blockchain">
            <a href="https://govchain.bettergov.ph/" target="_blank">
              Open Gov Blockchain
            </a>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
