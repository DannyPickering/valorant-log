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

interface AccountsComboboxProps {
  onSelectAccount: (selectedAccount: string) => void;
  userId: string
}

function AccountsCombobox({ onSelectAccount, userId }: AccountsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('');
  const [accounts, setAccounts] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const accountData = await getAllAccountsByUser(userId);
        setAccounts(accountData);
      } catch (error) {
        console.error('Error fetching profiles: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSelectAccount = (account: string) => {
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
          className="w-[200px] justify-between"
        >
          {value ? (
            accounts.find((account) => account === value) ? (
              <span className="capitalize">{value}</span>
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
            {accounts.map((account: string) => (
              <CommandItem
                className="capitalize"
                key={account}
                onSelect={() => handleSelectAccount(account)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === account ? "opacity-100" : "opacity-0"
                  )}
                />
                {account}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(AccountsCombobox);
