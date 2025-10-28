import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import DeleteAthleteStat from "./DeleteAthleteStat";
import EditAthleteStat from "./EditAthleteStat";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  return (
    <div className="flex flex-col gap-6">
      <h3>List of Games</h3>
      <Accordion type="single" collapsible className="w-full">
        {stats.map((stat, index) => (
          <AccordionItem key={stat._id} value={`game-${index}`}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <span>
                  Game {index + 1} —{" "}
                  {new Date(stat.recordedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2 "></div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-2">
                {STAT_INDEX.map(({ category, fields }) => (
                  <div key={category}>
                    <h4 className="font-semibold capitalize mb-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {fields.map(({ key, label }) => (
                        <div key={key} className="flex justify-between">
                          <span>{label}</span>
                          <span>{(stat as any)[category][key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-3 gap-3">
                <EditAthleteStat stat={stat} />
                <DeleteAthleteStat statId={stat._id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AthleteStatsList;
