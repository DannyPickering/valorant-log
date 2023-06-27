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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getAllAccountsByUser } from "@/lib/supabase-queries";
import { ValorantAccount } from "@/types/collections";

interface AccountsComboboxProps {
  onSelectAccount: (selectedAccount: ValorantAccount) => void;
  userId: string;
  disabled?: boolean;
}

function AccountsCombobox({ onSelectAccount, userId, disabled }: AccountsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<ValorantAccount>();
  const [accounts, setAccounts] = React.useState<ValorantAccount[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (userId && !disabled) {
        try {
          const accountData = await getAllAccountsByUser(userId);
          setAccounts(accountData);
        } catch (error) {
          console.error('Error fetching profiles: ', error);
        }
      }
    };
    fetchData();
  }, [disabled, userId]);

  const handleSelectAccount = (account: ValorantAccount) => {
    setValue(account);
    setOpen(false);
    onSelectAccount(account);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-[200px] justify-between disabled:opacity-50 disabled:pointer-events-none"
        >
          {value ? (
            accounts.find((account) => account.name === value.name) ? (
              <span className="capitalize">{value.name}</span>
            ) : (
              <span>Select an account</span>
            )
          ) : (
            <span>Select an account</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {accounts.map((account: ValorantAccount) => (
              <CommandItem
                className="capitalize"
                key={account.id}
                onSelect={() => handleSelectAccount(account)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === account ? "opacity-100" : "opacity-0"
                  )}
                />
                {account.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(AccountsCombobox);
