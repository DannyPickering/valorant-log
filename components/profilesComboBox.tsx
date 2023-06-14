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

import getAllProfiles from "@/lib/getAllProfiles";
import { Profile } from '@/types/collections';

interface ProfilesComboBoxProps {
  onSelectProfile: (selectedProfile: Profile) => void;
}

function ProfilesComboBox({ onSelectProfile }: ProfilesComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Profile>();
  const [profiles, setProfiles] = React.useState<Profile[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const profilesData = await getAllProfiles();
        setProfiles(profilesData);
      } catch (error) {
        console.error('Error fetching profiles: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSelectProfile = (profile: Profile) => {
    console.log(profile);

    setValue(profile);
    setOpen(false);
    onSelectProfile(profile);
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
            profiles.find((profile) => profile.discord_id === value.discord_id) ? (
              <span className="capitalize">{value.discord_id}</span>
            ) : (
              <span>Select a user</span>
            )
          ) : (
            <span>Select a user</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {profiles.map((profile: Profile) => (
              <CommandItem
                className="capitalize"
                key={profile.discord_id}
                onSelect={() => handleSelectProfile(profile)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.discord_id === profile.discord_id ? "opacity-100" : "opacity-0"
                  )}
                />
                {profile.discord_id}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(ProfilesComboBox);
