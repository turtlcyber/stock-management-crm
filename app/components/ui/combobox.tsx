"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  data: { label: string; value: string }[];
  placeholder?: string;
  value?: string | null;
  onValueChange?: (val: string) => void;
};

export function Combobox({ data, placeholder, value, onValueChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value1, setValue1] = React.useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value1
            ? data.find((el) => el.value === value1)?.label
            : placeholder
            ? `Select ${placeholder}`
            : "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder ? `Search ${placeholder}...` : "Search..."}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {placeholder ? `No ${placeholder} found.` : "Not found."}
            </CommandEmpty>
            <CommandGroup>
              {data.map((el) => (
                <CommandItem
                  key={el.label}
                  value={el.value}
                  onSelect={(currentValue) => {
                    setValue1(currentValue === value1 ? "" : currentValue);
                    if (onValueChange)
                      onValueChange(
                        currentValue === value1 ? "" : currentValue
                      );
                    setOpen(false);
                  }}
                >
                  {el.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value1 === el.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
