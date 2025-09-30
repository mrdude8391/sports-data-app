import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";
import { STAT_FIELDS } from "@/constants";
import type { StatForm } from "@/types/Stat";

const initialForm: StatForm = Object.fromEntries(
  Object.entries(STAT_FIELDS).map(([category, fields]) => [
    category,
    Object.fromEntries(fields.map((f) => [f.key, 0])),
  ])
);

const CreateAthleteStat = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const [form, setForm] = useState<StatForm>(initialForm);

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setForm(initialForm);
    },
  });

  const handleChange = (category: string, key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteId) {
      console.log(form);
      mutate({ athleteId, data: form });
    }
  };
  return (
    <div>
      <form id="statForm" className="space-y-6" onSubmit={handleSubmit}>
        {Object.entries(STAT_FIELDS).map(([category, fields]) => (
          <fieldset key={category} className="border p-4 rounded-md">
            <legend className="font-bold capitalize">{category}</legend>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {fields.map(({ key, label }) => (
                <Label key={key} className="flex flex-col">
                  <span className="text-sm text-gray-700">{label}</span>
                  <Input
                    type="number"
                    value={form[category][key]}
                    onChange={(e) =>
                      handleChange(category, key, Number(e.target.value))
                    }
                    className="border rounded p-2"
                  />
                </Label>
              ))}
            </div>
          </fieldset>
        ))}

        {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
      </form>
      <Button type="submit" form="statForm">
        Create Stat
      </Button>
    </div>
  );
};

export default CreateAthleteStat;
